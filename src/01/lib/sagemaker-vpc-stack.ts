import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';

export class SagemakerVpcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC with private subnets only
    const vpc = new ec2.Vpc(this, 'SagemakerVpc', {
      maxAzs: 3,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGateways: 0, // No NAT gateways as we don't want internet access
    });

    // Create VPC endpoints for SageMaker and other required AWS services
    vpc.addInterfaceEndpoint('SageMakerApi', {
      service: ec2.InterfaceVpcEndpointAwsService.SAGEMAKER_API,
    });

    vpc.addInterfaceEndpoint('SageMakerRuntime', {
      service: ec2.InterfaceVpcEndpointAwsService.SAGEMAKER_RUNTIME,
    });

    vpc.addInterfaceEndpoint('SageMakerNotebook', {
      service: ec2.InterfaceVpcEndpointAwsService.SAGEMAKER_NOTEBOOK,
    });

    // Add S3 gateway endpoint
    vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    // Add CloudWatch Logs endpoint
    vpc.addInterfaceEndpoint('CloudWatchLogs', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });

    // Create security group for SageMaker Studio
    const sagemakerSG = new ec2.SecurityGroup(this, 'SagemakerSecurityGroup', {
      vpc,
      description: 'Security group for SageMaker Studio',
      allowAllOutbound: false, // Restrict outbound traffic
    });

    // Allow HTTPS traffic within the security group
    sagemakerSG.addIngressRule(
      sagemakerSG,
      ec2.Port.tcp(443),
      'Allow HTTPS traffic within the security group'
    );

    // Create IAM role for SageMaker Studio
    const sagemakerRole = new iam.Role(this, 'SagemakerStudioRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
      ],
    });

    // Create SageMaker Studio Domain
    const domain = new sagemaker.CfnDomain(this, 'SagemakerStudioDomain', {
      authMode: 'IAM',
      defaultUserSettings: {
        executionRole: sagemakerRole.roleArn,
        securityGroups: [sagemakerSG.securityGroupId],
      },
      domainName: 'sagemaker-studio-domain',
      subnetIds: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }).subnetIds,
      vpcId: vpc.vpcId,
      appNetworkAccessType: 'VpcOnly', // Restrict to VPC only
    });

    // Create a default user profile
    const userProfile = new sagemaker.CfnUserProfile(this, 'DefaultUserProfile', {
      domainId: domain.attrDomainId,
      userProfileName: 'default-user',
      userSettings: {
        executionRole: sagemakerRole.roleArn,
      },
    });

    // Output the domain ID and user profile name
    new cdk.CfnOutput(this, 'SagemakerDomainId', {
      value: domain.attrDomainId,
      description: 'SageMaker Studio Domain ID',
    });

    new cdk.CfnOutput(this, 'SagemakerUserProfile', {
      value: userProfile.userProfileName,
      description: 'SageMaker Studio User Profile Name',
    });

    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      description: 'VPC ID',
    });
  }
}
