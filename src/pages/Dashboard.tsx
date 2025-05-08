import {
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconUsers, IconVaccine } from "@tabler/icons-react";
import React from "react";
import Header from "../components/header";
import useStudentDashboardData from "../utils/hooks/useStudentDashboardData";
import useVaccinationDriveData from "../utils/hooks/useVaccinationDrive";

const Dashboard: React.FC = () => {
  const {
    data: studentData,
    error: studentError,
    loading: studentDataLoading,
  } = useStudentDashboardData();
  const {
    data: drivesWithin30Days,
    error: drivesError,
    loading: drivesLoading,
  } = useVaccinationDriveData();
  return (
    <div>
      <Header />
      <Container size={"lg"} mt="md">
        <Grid justify="space-around">
          <Grid.Col span={4}>
            <Card shadow="sm" padding="sm">
              <Group justify="center" align="center">
                <Text c="cyan">Total Students</Text>
                <IconUsers color="cyan" size={24} />
              </Group>
              <Title order={3} c="blue">
                {studentDataLoading ? (
                  <Loader size="sm" />
                ) : studentError ? (
                  <Text c="red">Error</Text>
                ) : (
                  studentData?.total_students
                )}
              </Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" padding="sm">
              <Group justify="center" align="center">
                <Text c="cyan">Vaccinated Students</Text>
                <IconVaccine color="cyan" size={24} />
              </Group>
              <Title order={3} c="blue">
                {studentDataLoading ? (
                  <Loader size="sm" />
                ) : studentError ? (
                  <Text c="red">Error</Text>
                ) : (
                  <>
                    {studentData?.vaccinated_students}(
                    {(
                      ((studentData?.vaccinated_students ?? 0) /
                        (studentData?.total_students ?? 1)) *
                      100
                    ).toFixed(2)}
                    % )
                  </>
                )}
              </Title>
            </Card>
          </Grid.Col>
        </Grid>

        <Title order={3} mt="xl" mb="md">
          Upcoming Vaccination Drives
        </Title>
        <Card shadow="sm" padding="sm">
          {drivesLoading ? (
            <Loader size="sm" />
          ) : drivesError ? (
            <Text c="red">Error</Text>
          ) : (
            <>
              {drivesWithin30Days.length > 0 ? (
                <Table>
                  <thead>
                    <tr>
                      <th>Vaccine Name</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivesWithin30Days.map((drive) => (
                      <tr key={drive.id}>
                        <td>{drive.vaccine_name}</td>
                        <td>
                          {new Date(drive.drive_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Text>
                  No vaccination drives scheduled in the next 30 days.
                </Text>
              )}
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
