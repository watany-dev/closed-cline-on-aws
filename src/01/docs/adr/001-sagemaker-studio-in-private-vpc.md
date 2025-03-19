# SageMaker Studio in Private VPC

**Date:** 2025-03-19

## Status

Accepted

## Context

We need to create a secure environment for data scientists to work with sensitive data using SageMaker Studio. The environment must not have direct internet access to prevent data exfiltration and reduce the attack surface. However, users still need to be able to access the SageMaker Studio environment.

## Decision

We have decided to implement the following architecture:

1. Create a VPC with private subnets only (no public subnets)
2. Do not configure NAT Gateways to ensure no internet access
3. Set up VPC endpoints for the following AWS services:
   - SageMaker API
   - SageMaker Runtime
   - SageMaker Notebook
   - S3
   - CloudWatch Logs
4. Configure a security group that restricts outbound traffic and only allows HTTPS traffic within the security group
5. Create an IAM role with the necessary permissions for SageMaker Studio
6. Configure SageMaker Studio Domain with `appNetworkAccessType: 'VpcOnly'` to restrict network access to the VPC

## Consequences

### Positive

- Enhanced security posture by eliminating direct internet access
- Reduced attack surface for potential threats
- Compliance with strict security requirements
- Data scientists can still access SageMaker Studio and perform their work
- AWS services can be accessed securely through VPC endpoints

### Negative

- Users cannot download packages or data from the internet directly
- Additional operational complexity in managing VPC endpoints
- Potential limitations in accessing external resources
- May require additional processes for importing data and models

## Alternatives Considered

### Public Subnets with NAT Gateway

We considered using a VPC with public subnets and NAT Gateways to allow outbound internet access while still restricting inbound traffic. This would provide more flexibility for users to download packages and access external resources. However, this approach was rejected because it would not meet the strict security requirements of preventing data exfiltration.

### Using AWS PrivateLink for All Services

We considered using AWS PrivateLink for all required AWS services. While this would provide a more consistent approach to accessing AWS services, it would increase costs and complexity. We opted for a mix of interface endpoints and gateway endpoints (for S3) to optimize for cost and performance.

## References

- [AWS SageMaker Studio VPC documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-vpc.html)
- [AWS VPC Endpoints documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html)
- [AWS Security Best Practices](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
