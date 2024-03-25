import AWS from 'aws-sdk';
import https from 'https';

AWS.config.update({ region: 'us-east-1' });

const S3 = AWS.S3;
const SSM = AWS.SSM;

const ssm = new AWS.SSM({ region: 'us-east-1' });
const ssmParameterName = '/food-delivery/app/aws-credentials';

/**
 * Get the value of a parameter from AWS Systems Manager Parameter Store
 *
 * @param parameterName The name of the parameter to retrieve
 * @returns The value of the parameter as a string
 */
export const getSSMParameter = async (
  parameterName: string
): Promise<string | undefined> => {
  const params: AWS.SSM.GetParameterRequest = {
    Name: parameterName,
    WithDecryption: true,
  };

  const { Parameter } = await ssm.getParameter(params).promise();
  console.log(Parameter);
  return Parameter?.Value;
};

const initializeAWS = async () => {
  //const awsCredentials = JSON.parse(await getSSMParameter(ssmParameterName));

  const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
    httpOptions: {
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    },
  };

  return awsConfig;
};

const s3 = async () => {
  const config = await initializeAWS();

  return new S3(config);
};

const sns = async () => {
  const config = await initializeAWS();
  return new AWS.SNS(config);
};
export { s3, sns };
