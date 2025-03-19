import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SagemakerVpcStack } from '../lib/001-sagemaker-studio-in-private-vpc-stack';

test('VPC Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::EC2::VPC', 1);
});

test('SageMaker Studio Domain Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::SageMaker::Domain', 1);
});

test('VPC Endpoints Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  // Check for VPC endpoints
  template.resourceCountIs('AWS::EC2::VPCEndpoint', 5); // 4 interface endpoints + 1 gateway endpoint
});

test('Security Group Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::EC2::SecurityGroup', 5);
});

test('IAM Role Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::IAM::Role', 1);
});

test('User Profile Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::SageMaker::UserProfile', 1);
});
