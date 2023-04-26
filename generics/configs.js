
const AppConfig = {
    AwsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    SecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Region: 'us-east-2', // process.env.AWS_REGION,
    BucketName: 'chikkiaquatics.com', // process.env.AWS_S3_PUBLIC_BUCKET_NAME,
    StripeKey: process.env.STRIPE_KEY,
}

module.exports = {
    AppConfig
}
