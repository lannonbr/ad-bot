const { Stack } = require("aws-cdk-lib");
const {
  GithubActionsIdentityProvider,
  GithubActionsRole,
} = require("aws-cdk-github-oidc");
const iam = require("aws-cdk-lib/aws-iam");

class CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const provider = GithubActionsIdentityProvider.fromAccount(
      this,
      "GitHubActionsProvider"
    );

    const actionsRole = new GithubActionsRole(this, "ActionsRole", {
      provider,
      owner: "lannonbr",
      repo: "ad-bot",
      filter: "ref:refs/heads/main",
    });

    actionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSElasticBeanstalkWebTier")
    );
    actionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy"
      )
    );

    const instanceRole = new iam.Role(this, "InstanceRole", {
      roleName: "iamInstanceRole",
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSElasticBeanstalkWebTier")
    );
    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy"
      )
    );

    new iam.CfnInstanceProfile(this, "InstanceProfile", {
      instanceProfileName: "ADInstanceProfile",
      roles: [instanceRole.roleName],
    });
  }
}

module.exports = { CdkStack };
