import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Text } from "@react-email/text";
import * as React from "react";

export const TelegramVoiceTaskTemplate = ({
  heading,
  transcriptLabel,
  transcript,
  summaryLabel,
  summary,
}: {
  heading: string;
  transcriptLabel: string;
  transcript: string;
  summaryLabel: string;
  summary: string;
}) => (
  <Html>
    <Head />
    <Preview>{heading}</Preview>
    <Body style={{ backgroundColor: "white" }}>
      <Container
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          margin: "auto",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
        }}
      >
        <Heading
          style={{
            marginTop: "2.5rem",
            marginBottom: "2.5rem",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#232323",
          }}
        >
          Nexora
        </Heading>
        <Heading
          style={{ fontSize: "24px", fontWeight: "bold", color: "#232323" }}
        >
          {heading}
        </Heading>
        <Text
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            marginBottom: "0.25rem",
            color: "#7e7e7e",
            textTransform: "uppercase",
          }}
        >
          {transcriptLabel}
        </Text>
        <Text
          style={{
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
            color: "#232323",
            fontStyle: "italic",
          }}
        >
          &ldquo;{transcript}&rdquo;
        </Text>
        <Text
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            marginBottom: "0.25rem",
            color: "#7e7e7e",
            textTransform: "uppercase",
          }}
        >
          {summaryLabel}
        </Text>
        <Text
          style={{
            fontSize: "0.875rem",
            marginBottom: "1rem",
            color: "#232323",
            whiteSpace: "pre-line",
          }}
        >
          {summary}
        </Text>
        <Hr
          style={{
            marginTop: "2.5rem",
            marginBottom: "2rem",
            borderWidth: "1px",
          }}
        />
        <Text style={{ color: "#7e7e7e" }}>Nexora</Text>
      </Container>
    </Body>
  </Html>
);

export default TelegramVoiceTaskTemplate;
