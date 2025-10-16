"use client";

import { MantineProvider, Box, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import "@mantine/core/styles.css";

export default function Page() {
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: new Date(),
      message: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid"),
      phone: (value) => (/^\+?[1-9]\d{1,20}$/.test(value) ? null : "Invalid"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    alert(`Form submitted\n${JSON.stringify(values, null, 2)}`);
  };

  return (
    <MantineProvider defaultColorScheme="auto">
      <Box maw={400} mx="auto" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="First name"
            placeholder="Enter first name"
            {...form.getInputProps("firstName")}
            required
            mb="sm"
          />
          <TextInput
            label="Last name"
            placeholder="Enter last name"
            {...form.getInputProps("lastName")}
            required
            mb="sm"
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...form.getInputProps("email")}
            required
            mb="sm"
          />
          <TextInput
            label="Phone number"
            placeholder="Enter phone number"
            {...form.getInputProps("phone")}
            required
            mb="sm"
          />
          <TextInput
            label="Message"
            placeholder="Enter message"
            {...form.getInputProps("message")}
            required
            mb="sm"
          />
          <Button type="submit">Submit</Button>
        </form>
      </Box>
    </MantineProvider>
  );
}
