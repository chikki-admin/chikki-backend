
const AppConfig = {
    AwsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    SecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Region: 'us-east-2', // process.env.AWS_REGION,
    BucketName: 'chikkiaquatics.com', // process.env.AWS_S3_PUBLIC_BUCKET_NAME,
    StripeKey: process.env.STRIPE_KEY || "sk_test_51MrE0PJN8JLDL0ga0Xt2I9zDq8v2mrRNPfDFahHXPAGOvdnIw5Z1V3FrjW1y0adrsRV8zGnWGw6ouyU5GWo6ExIm00gupXlgzt",
    ChikkiEmailPassword: process.env.CHIKKI_EMAIL_PASSWORD
}

module.exports = {
    AppConfig
}
