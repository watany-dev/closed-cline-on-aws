# SageMaker Studio in Private VPC

This project creates a secure SageMaker Studio environment within a private VPC without internet access. It demonstrates how to set up a secure data science environment that complies with strict security requirements.

## Architecture

The infrastructure includes:

1. **VPC with Private Subnets**: A VPC configured with private subnets only, without internet access.
2. **VPC Endpoints**: Interface and gateway endpoints for SageMaker API, Runtime, Notebook, S3, and CloudWatch Logs.
3. **SageMaker Studio Domain**: Configured to operate within the VPC without internet access.
4. **Security Group**: Restricts traffic to only necessary communications.
5. **IAM Role**: Provides the necessary permissions for SageMaker Studio.

## Security Features

- No internet access from the VPC
- Restricted outbound traffic from security groups
- Least privilege IAM policies
- VPC endpoints for secure AWS service access

## Deployment

To deploy this stack:

```bash
npm run build
npx cdk deploy
```

## Testing

Run the tests to verify the infrastructure:

```bash
npm test
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
