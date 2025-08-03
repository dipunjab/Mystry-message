import {
  Html,
  Head,
  Font,
  Preview,
  Section,
  Heading,
  Text,
  Row,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}



export default function VerificationEmail({
  username,
  otp
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head >
        <Font
        fontFamily="Roboto"
        fallbackFontFamily="Verdana"
        fontWeight={400}
        fontStyle="normal"
        />
      </Head> 
        <Preview>Here&apos;s your verification code: {otp}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {username},</Heading>
          </Row>
          <Row>
            <Text>
              Thanks your for registering. Please use the following verification code to complete your registration.
            </Text>
          </Row>
          <Row>{otp}</Row>
          <Row>
            <Text>If u did not request this code please ignore this email</Text>
          </Row>
        </Section>
       
    </Html>
  );
}
