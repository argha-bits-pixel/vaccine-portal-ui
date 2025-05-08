import {
  Button,
  Card,
  Container,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import React, { useState } from "react";
import Header from "../components/header";
import { classes, vaccines } from "../utils/constants";
import useVaccinationDrive from "../utils/hooks/useVaccinationDrive";
import {
  ErrorRespObject,
  SuccessRespObject,
  VaccineDriveFormSchema,
  VaccineDriveInfo,
} from "../utils/types";
import { isResponseSuccess } from "../utils/helper";
import useNotification from "../utils/hooks/useNotification";

const formatDateToISOWithUTC = (date: Date): string => {
  return `${date.toISOString().split(".")[0]}+00:00`;
};

const date15DaysFromNow = new Date();
date15DaysFromNow.setDate(date15DaysFromNow.getDate() + 16);

const VaccinationDriveManagement: React.FC = () => {
  const {
    data: drives,
    addDrive,
    updateDrive,
    fetchData,
  } = useVaccinationDrive();
  const { notifyError, notifySuccess } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<
    (VaccineDriveFormSchema | VaccineDriveInfo) | null
  >(null);

  const form = useForm<VaccineDriveFormSchema>({
    initialValues: {
      vaccine_name: vaccines[0],
      drive_date: date15DaysFromNow.toISOString().split("T")[0],
      doses: 0,
      classes: [],
    },
    validate: {
      vaccine_name: (value) =>
        value === null || value.length < 1
          ? "Vaccine name cannot be empty"
          : null,
      drive_date: (value) =>
        value.length < 1 ? "Drive date cannot be empty" : null,
      doses: (value) => (value < 1 ? "doses No cannot be empty" : null),
      classes: (value) =>
        value.length < 1 ? "Classes No cannot be empty" : null,
    },
  });

  const handleSubmitAddEditDrive = React.useCallback(
    async (drive: VaccineDriveFormSchema) => {
      const commaSeparatedValues = drive.classes.join(", ");

      if (editingDrive) {
        const rec: Partial<VaccineDriveInfo> = { id: editingDrive.id };
        const dirtyFields = form.getDirty();
        Object.keys(dirtyFields).forEach((y) => {
          const x = y as keyof VaccineDriveInfo;
          if (dirtyFields[x]) {
            if (x === "classes") {
              rec[x] = commaSeparatedValues as any;
            } else if (x === "drive_date") {
              rec[x] = formatDateToISOWithUTC(
                new Date(drive.drive_date)
              ) as any;
            } else {
              rec[x] = drive[x] as any;
            }
          }
        });
        const resp = await updateDrive(rec);
        if (!isResponseSuccess(resp)) {
          notifyError(
            (resp as ErrorRespObject).error,
            (resp as ErrorRespObject).message
          );
        } else {
          notifySuccess((resp as SuccessRespObject<VaccineDriveInfo>).message);
        }
      } else {
        const resp = await addDrive({
          ...drive,
          drive_date: formatDateToISOWithUTC(new Date(drive.drive_date)),
          classes: commaSeparatedValues,
        });
        if (!isResponseSuccess(resp)) {
          notifyError(
            (resp as ErrorRespObject).error,
            (resp as ErrorRespObject).message
          );
        } else {
          notifySuccess((resp as SuccessRespObject<VaccineDriveInfo>).message);
        }
      }
      setModalOpen(false);
      setEditingDrive(null);
      form.reset();
      await fetchData();
    },
    [
      addDrive,
      editingDrive,
      fetchData,
      form,
      notifyError,
      notifySuccess,
      updateDrive,
    ]
  );

  const handleClickEdit = React.useCallback(
    (drive: VaccineDriveInfo) => {
      const classesArray = drive.classes.split(", ");
      setEditingDrive(drive);
      form.setValues({ ...drive, classes: classesArray });
      setModalOpen(true);
    },
    [form]
  );

  return (
    <div>
      <Header />
      <Container mt="md" size="lg">
        {/* Add Drive Button */}
        <Group mb="md">
          <Group>
            <Button
              leftSection={<IconPlus />}
              onClick={() => setModalOpen(true)}
              mb="md"
            >
              Add Drive
            </Button>
          </Group>
        </Group>

        {/* Drives Table */}
        <Card
          shadow="sm"
          padding="xs"
          style={{ overflowY: "auto", maxHeight: "calc(100vh - 400px)" }}
        >
          <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Vaccine Name</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Doses</Table.Th>
                <Table.Th>Classes</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {drives.map((drive) => (
                <Table.Tr key={drive.id}>
                  <Table.Td>{drive?.id}</Table.Td>
                  <Table.Td>{drive.vaccine_name}</Table.Td>
                  <Table.Td>
                    {new Date(drive.drive_date).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>{drive.doses}</Table.Td>
                  <Table.Td>{drive.classes}</Table.Td>
                  <Table.Td>
                    <Button
                      leftSection={<IconEdit />}
                      variant="light"
                      onClick={() => handleClickEdit(drive)}
                      disabled={new Date(drive.drive_date) < new Date()}
                    >
                      Edit
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Add/Edit Drive Modal */}
        <Modal
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingDrive(null);
            form.reset();
          }}
          title={editingDrive ? "Edit Drive" : "Add Drive"}
        >
          <form onSubmit={form.onSubmit(handleSubmitAddEditDrive)}>
            <Select
              label="Vaccine Name"
              placeholder="Select vaccine"
              data={vaccines}
              {...form.getInputProps("vaccine_name")}
            />

            <TextInput
              label="Drive Date"
              placeholder="Enter vaccine date"
              type="date"
              min={
                editingDrive
                  ? undefined
                  : date15DaysFromNow.toISOString().split("T")[0]
              }
              {...form.getInputProps("drive_date")}
            />

            <NumberInput
              label="Number of Doses"
              placeholder="Enter number of doses"
              {...form.getInputProps("doses")}
            />
            <MultiSelect
              label="Applicable Classes"
              placeholder="Select classes"
              data={classes}
              {...form.getInputProps("classes")}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">
                {editingDrive ? "Save Changes" : "Add Drive"}
              </Button>
            </Group>
          </form>
        </Modal>
      </Container>
    </div>
  );
};

export default VaccinationDriveManagement;
