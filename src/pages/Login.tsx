import {
  Button,
  Container,
  Grid,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { setCookie } from "../utils/helper";
import { useNavigate } from "react-router";

interface UserSchema {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginForm = useForm<UserSchema>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => {
        if (value === null || value.length < 1) {
          return "Username is required";
        }
        if (value !== "admin") {
          return "Wrong username";
        }
        return null;
      },
      password: (value) => {
        if (value === null || value.length < 1) {
          return "Password is required";
        }
        if (value !== "admin") {
          return "Wrong passsword";
        }
        return null;
      },
    },
  });
  const handleSubmit = (value: UserSchema) => {
    setCookie("token", `${value.username}:${value.password}`, 1);
    navigate("/dashboard");
  };

  return (
    <Container size={"lg"} my={40}>
      <Title
        style={{
          fontFamily: "Greycliff CF, sans-serif",
          fontWeight: 900,
          color: "var(--mantine-color-blue-6)",
        }}
      >
        Login
      </Title>

      <Paper shadow="md" p={30} mt={30} radius="md">
        <Grid justify="center" align="center">
          <form onSubmit={loginForm.onSubmit(handleSubmit)}>
            <Stack gap="md" style={{ width: "300px" }}>
              <TextInput
                label="Username"
                placeholder="Enter your username"
                {...loginForm.getInputProps("username")}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                {...loginForm.getInputProps("password")}
              />
              <Button type="submit" fullWidth>
                Login
              </Button>
            </Stack>
          </form>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
