import { ReactNode } from "react";
import { Container, Paper } from "@mantine/core";

export default function PaymentStatusLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Container size="sm" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <Paper withBorder shadow="md" p="xl" radius="md">
        {children}
      </Paper>
    </Container>
  );
}
