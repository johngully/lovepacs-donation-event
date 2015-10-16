# Developer Setup

## Running the node server
```bash
$ cd {project}/server
$ node app
```

## Stripe configuration
Stripe requires both a public and server key to support credit card payment processing. In order to keep these keys private they are configured in the environment variables `STRIPE_PUBLIC_KEY` and `STRIPE_SERVER_KEY`.

##### NEVER ADD THE STRIPE KEYS TO SOURCE CONTROL

For development purposes these can be emulated by adding a `stripe.json` to the root of the project:
```json
{
  "STRIPE_PUBLIC_KEY": "XXXXX",
  "STRIPE_SERVER_KEY": "YYYYY"
}
```

For a more permanent solution you can add these to your environment variables by adding the following lines to the `.bash_profile` in your home directory:
```bash
$ nano .bash_profile
export STRIPE_PUBLIC_KEY="XXXXX"
export STRIPE_SERVER_KEY="YYYYY"
```
