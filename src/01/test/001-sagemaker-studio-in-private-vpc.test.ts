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

test('S3 Gateway Endpoint Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  // Check for S3 gateway endpoint
  template.resourceCountIs('AWS::EC2::VPCEndpoint', 1);
});

test('NAT Gateway Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  // Check for NAT Gateway
  template.resourceCountIs('AWS::EC2::NatGateway', 1);
});

test('Security Group Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SagemakerVpcStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  // Security group for SageMaker Studio
  template.resourceCountIs('AWS::EC2::SecurityGroup', 1);
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
