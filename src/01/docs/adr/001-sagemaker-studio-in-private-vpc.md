# SageMaker Studio in Private VPC with NAT Gateway

**Date:** 2025-03-19

## Status

Accepted (Updated: 2025-03-19)

## Context

We need to create a secure environment for data scientists to work with sensitive data using SageMaker Studio. Initially, the environment was designed without direct internet access to prevent data exfiltration and reduce the attack surface. However, after further evaluation, it was determined that controlled internet access via NAT Gateway is necessary for certain workflows while maintaining security controls.

## Decision

We have decided to implement the following architecture:

1. Create a VPC with both public and private subnets
2. Configure a NAT Gateway to allow controlled outbound internet access
3. Set up VPC endpoint for S3 (Gateway endpoint)
4. Configure a security group that allows outbound HTTPS traffic via NAT Gateway
5. Create an IAM role with the necessary permissions for SageMaker Studio
6. Configure SageMaker Studio Domain with `appNetworkAccessType: 'VpcOnly'` to restrict network access to the VPC

## Consequences

### Positive

- Controlled outbound internet access allows data scientists to download packages and access external resources
- Reduced operational complexity by eliminating the need for multiple interface VPC endpoints
- Improved developer experience with access to public repositories and resources
- Maintained security with controlled egress through NAT Gateway
- AWS S3 service can still be accessed securely through Gateway endpoint for cost optimization

### Negative

- Slightly increased attack surface compared to completely isolated environment
- Additional cost for NAT Gateway
- Need for additional security monitoring of outbound traffic

## Alternatives Considered

### Completely Isolated Environment

Our initial approach was to use a VPC with private subnets only and no NAT Gateways to ensure no internet access. While this provided maximum security against data exfiltration, it created significant operational challenges for data scientists who needed to access external resources and packages. After evaluation, we determined that the security benefits did not outweigh the operational constraints.

### Using AWS PrivateLink for All Services

We considered using AWS PrivateLink (Interface VPC Endpoints) for all required AWS services. While this would provide a more consistent approach to accessing AWS services without internet access, it would increase costs and complexity. With the decision to implement NAT Gateway, we determined that most Interface VPC Endpoints were no longer necessary, except for S3 Gateway Endpoint which we retained for cost optimization.

## References

- [AWS SageMaker Studio VPC documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-vpc.html)
- [AWS VPC Endpoints documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html)
- [AWS Security Best Practices](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
