import { ActionIcon, Button, Grid, Group, Text } from "@mantine/core";
import {
  IconChartBar,
  IconLogout,
  IconReport,
  IconUser,
  IconVaccineBottle,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router";
import { deleteCookie } from "../../utils/helper";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <header style={{ backgroundColor: "#f5f5f5", minHeight: "64px" }}>
      <Grid justify="space-between" align="center" h="100%">
        <Grid.Col span={2} />
        <Grid.Col span={8}>
          <Text c="blue" fw={500} pl="md" size="lg">
            School Vaccination Portal
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <ActionIcon
            aria-label="logout"
            onClick={() => {
              deleteCookie("token");
              navigate("/login");
            }}
          >
            <IconLogout />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Grid justify="center" align="center">
        <Grid.Col span={2} />
        <Grid.Col span={8}>
          <Group justify="center">
            <Button
              component={Link}
              to="/dashboard"
              leftSection={<IconChartBar />}
              variant={
                location.pathname === "/dashboard" ? "filled" : "default"
              }
            >
              Dashboard
            </Button>

            <Button
              component={Link}
              to="/students"
              leftSection={<IconUser />}
              variant={location.pathname === "/students" ? "filled" : "default"}
            >
              Student Management
            </Button>
            <Button
              component={Link}
              to="/vaccination-drive"
              leftSection={<IconVaccineBottle />}
              variant={
                location.pathname === "/vaccination-drive"
                  ? "filled"
                  : "default"
              }
            >
              Drive Management
            </Button>
            <Button
              component={Link}
              to="/reports"
              leftSection={<IconReport />}
              variant={location.pathname === "/reports" ? "filled" : "default"}
            >
              Reports
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={2} />
      </Grid>
    </header>
  );
};
export default Header;
