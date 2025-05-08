import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Pagination,
  Select,
  Skeleton,
  Table,
  TextInput,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconSearch, IconVaccine } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { classes, genders, vaccines } from "../utils/constants";
import { isResponseSuccess } from "../utils/helper";
import useNotification from "../utils/hooks/useNotification";
import useStudent from "../utils/hooks/useStudent";
import {
  ErrorRespObject,
  ImportRecordStatusResp,
  Student,
  SuccessRespObject,
  VaccineStudentFormSchema,
} from "../utils/types";

const limit = 5;

const StudentManagement: React.FC = () => {
  const {
    addStudent,
    fetchStudents,
    vaccinateStudent,
    loading,
    students,
    updateStudent,
    total,
    bulkUpload,
    bulkUploadVaccineRecords,
    saving,
    generateReport,
  } = useStudent();
  const { notifyError, notifySuccess } = useNotification();
  const [searchQueryObj, setSearchQueryObj] = useState<{
    name: string;
    class: string;
    gender: string;
    roll_no: string;
    phone_no: string;
    vaccine_name: string;
    vaccination: boolean | null;
  }>({
    name: "",
    class: "",
    gender: "",
    roll_no: "",
    phone_no: "",
    vaccine_name: "",
    vaccination: null,
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [vaccinateModalOpen, setVaccinateModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [page, setPage] = useState(1);

  const [modalOpenGeRep, setModalOpenGeRep] = useState(false);
  const [link, setLink] = useState<
    ErrorRespObject | ImportRecordStatusResp | null
  >(null);

  const form = useForm<Student>({
    initialValues: {
      name: "",
      class: "",
      gender: "",
      roll_no: "",
      phone_no: "",
    },
    validate: {
      name: (value) => {
        return value.length === 0
          ? "Name is required"
          : value.length < 3
          ? "Name should be at least 3 characters long"
          : null;
      },
      class: (value) =>
        value === null || value.length < 1 ? "Class is required" : null,
      gender: (value) =>
        value === null || value.length < 1 ? "Gender is required" : null,
      roll_no: (value) => (value.length < 1 ? "Roll No is required" : null),
      phone_no: (value) => (value.length < 1 ? "Phone No is required" : null),
    },
  });

  const vaccinateForm = useForm<VaccineStudentFormSchema>({
    initialValues: {
      student_id: null,
      drive_id: null,
    },
    validate: {
      student_id: (value) => (value === null ? "Student id is required" : null),
      drive_id: (value) => (value === null ? "Drive id is required" : null),
    },
  });

  useEffect(() => {
    fetchStudents({
      limit,
      page,
      searchQueryObj,
    });
  }, [fetchStudents, page, searchQueryObj]);

  const handleSubmitAddEditStudent = React.useCallback(
    async (values: Student) => {
      if (editingStudent) {
        const rec: Partial<Student> = { id: editingStudent.id };
        const dirtyFields = form.getDirty();
        Object.keys(dirtyFields).forEach((x) => {
          if (dirtyFields[x]) {
            rec[x as keyof Student] = values[x as keyof Student] as any;
          }
        });

        const resp = await updateStudent(rec);
        if (!isResponseSuccess(resp)) {
          notifyError(
            (resp as ErrorRespObject).error,
            (resp as ErrorRespObject).message
          );
          return;
        } else {
          notifySuccess((resp as SuccessRespObject<Student>).message);
        }
      } else {
        const resp = await addStudent(values);
        if (!isResponseSuccess(resp)) {
          notifyError(
            (resp as ErrorRespObject).error,
            (resp as ErrorRespObject).message
          );
          return;
        } else {
          notifySuccess((resp as SuccessRespObject<Student>).message);
        }
      }
      setModalOpen(false);
      setEditingStudent(null);
      form.reset();
      fetchStudents({
        limit,
        page,
        searchQueryObj,
      });
    },
    [
      addStudent,
      editingStudent,
      fetchStudents,
      form,
      notifyError,
      notifySuccess,
      page,
      searchQueryObj,
      updateStudent,
    ]
  );

  const handleBulkUploadStudent = React.useCallback(
    async (file: File) => {
      const resp = await bulkUpload(file);
      if (!isResponseSuccess(resp)) {
        notifyError(
          (resp as ErrorRespObject).error,
          (resp as ErrorRespObject).message
        );
      } else {
        notifySuccess((resp as SuccessRespObject<Student>).message);
      }
    },
    [bulkUpload, notifyError, notifySuccess]
  );

  const handleBulkVaccineRecords = React.useCallback(
    async (file: File) => {
      const resp = await bulkUploadVaccineRecords(file);
      if (!isResponseSuccess(resp)) {
        notifyError(
          (resp as ErrorRespObject).error,
          (resp as ErrorRespObject).message
        );
      } else {
        notifySuccess((resp as SuccessRespObject<Student>).message);
      }
    },
    [bulkUploadVaccineRecords, notifyError, notifySuccess]
  );

  const handleVaccinate = React.useCallback(
    (student: Student) => {
      setEditingStudent(student);
      vaccinateForm.setValues({
        student_id: student.id || null,
        drive_id: null,
      });
      setVaccinateModalOpen(true);
    },
    [vaccinateForm]
  );

  const handleSubmitStudentVaccination = React.useCallback(
    async (values: VaccineStudentFormSchema) => {
      const resp = await vaccinateStudent(values);
      if (!isResponseSuccess(resp)) {
        notifyError(
          (resp as ErrorRespObject).error,
          (resp as ErrorRespObject).message
        );
        return;
      } else {
        notifySuccess((resp as SuccessRespObject<Student>).message);
      }
      setVaccinateModalOpen(false);
      setEditingStudent(null);
      vaccinateForm.reset();
      fetchStudents({
        limit,
        page,
        searchQueryObj,
      });
    },
    [
      fetchStudents,
      notifyError,
      notifySuccess,
      page,
      searchQueryObj,
      vaccinateForm,
      vaccinateStudent,
    ]
  );

  const handleEdit = React.useCallback(
    (student: Student) => {
      setEditingStudent(student);
      form.setValues(student);
      setModalOpen(true);
    },
    [form]
  );

  const handleChangeQuery = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setSearchQueryObj((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleClickGenerateRep = React.useCallback(async () => {
    let query = "";
    Object.keys(searchQueryObj).forEach((key) => {
      if (
        (key === "class" || key === "vaccine_name") &&
        searchQueryObj[key as keyof typeof searchQueryObj]
      ) {
        query += `${key}=${
          searchQueryObj[key as keyof typeof searchQueryObj]
        }&`;
      }
    });
    const resp = await generateReport(query);

    setLink(resp);
  }, [generateReport, searchQueryObj]);

  return (
    <div>
      <Header />
      <Container mt="md" size="lg">
        <Group mb="md">
          <Group>
            <Button onClick={() => setModalOpen(true)}>Add Student</Button>
            <FileInput
              placeholder="Bulk Student Import"
              accept=".xlsx"
              onChange={(file) => {
                if (file) handleBulkUploadStudent(file);
              }}
              color="blue"
            />
            <FileInput
              placeholder="Bulk Vaccine Records Import"
              accept=".xlsx"
              onChange={(file) => {
                if (file) handleBulkVaccineRecords(file);
              }}
              color="blue"
            />
            <Button onClick={() => setModalOpenGeRep(true)}>
              Generate Report
            </Button>
          </Group>
        </Group>
        <Card shadow="sm" padding="xs">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th style={{ width: "150px" }}>
                  Name
                  <TextInput
                    placeholder="Search"
                    leftSection={<IconSearch size={"16px"} />}
                    size="xs"
                    value={searchQueryObj.name}
                    name="name"
                    onChange={handleChangeQuery}
                    __clearable
                  />
                </Table.Th>
                <Table.Th>
                  Class
                  <Select
                    placeholder="Search"
                    leftSection={<IconSearch size={"16px"} />}
                    size="xs"
                    data={classes}
                    value={searchQueryObj.class}
                    onChange={(value) => {
                      setPage(1);
                      setSearchQueryObj((prev) => ({
                        ...prev,
                        class: value || "",
                      }));
                    }}
                    clearable
                  />
                </Table.Th>
                <Table.Th>Gender</Table.Th>
                <Table.Th>
                  Roll No
                  <TextInput
                    placeholder="Search"
                    leftSection={<IconSearch size={"16px"} />}
                    size="xs"
                    name="roll_no"
                    value={searchQueryObj.roll_no}
                    onChange={handleChangeQuery}
                  />
                </Table.Th>
                <Table.Th>Phone No</Table.Th>
                <Table.Th style={{ width: "150px" }}>
                  Vaccinated
                  <Select
                    placeholder="Search"
                    leftSection={<IconSearch size={"16px"} />}
                    size="xs"
                    data={["Yes", "No"]}
                    value={searchQueryObj.vaccine_name}
                    onChange={(value) => {
                      setPage(1);
                      setSearchQueryObj((prev) => {
                        let val = null;
                        switch (value) {
                          case "Yes":
                            val = true;
                            break;
                          case "No":
                            val = false;
                            break;
                          default:
                            val = null;
                        }
                        return {
                          ...prev,
                          vaccination: val,
                        };
                      });
                    }}
                    clearable
                  />
                </Table.Th>
                <Table.Th style={{ width: "120px" }}>
                  Vaccine
                  <Select
                    placeholder="Search"
                    leftSection={<IconSearch size={"16px"} />}
                    size="xs"
                    data={vaccines}
                    value={searchQueryObj.vaccine_name}
                    onChange={(value) => {
                      setPage(1);
                      setSearchQueryObj((prev) => ({
                        ...prev,
                        vaccine_name: value || "",
                      }));
                    }}
                    clearable
                  />
                </Table.Th>
                <Table.Th style={{ width: "80px" }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!loading && (
              <Table.Tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <Table.Td>{student.id}</Table.Td>
                    <Table.Td>{student.name}</Table.Td>
                    <Table.Td>{student.class}</Table.Td>
                    <Table.Td>{student.gender}</Table.Td>
                    <Table.Td>{student.roll_no}</Table.Td>
                    <Table.Td>{student.phone_no}</Table.Td>
                    <Table.Td>{student.vaccination ? "Yes" : "No"}</Table.Td>
                    <Table.Td>{student.vaccine_name}</Table.Td>
                    <Table.Td>
                      <Group dir="col">
                        <ActionIcon
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <IconEdit />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          onClick={() => handleVaccinate(student)}
                          disabled={student.vaccination}
                        >
                          <IconVaccine />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </tr>
                ))}
              </Table.Tbody>
            )}
          </Table>
          {loading && (
            <Box style={{ width: "100%" }}>
              <Skeleton height={36} width="100%" />
              <Skeleton height={36} width="100%" />
              <Skeleton height={36} width="100%" />
              <Skeleton height={36} width="100%" />
              <Skeleton height={36} width="100%" />
            </Box>
          )}

          <Pagination
            total={Math.ceil(total / limit)}
            value={page}
            onChange={setPage}
            mt="md"
          />
        </Card>

        <Modal
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingStudent(null);
            form.reset();
          }}
          title={editingStudent ? "Edit Student" : "Add Student"}
        >
          <form onSubmit={form.onSubmit(handleSubmitAddEditStudent)}>
            <TextInput
              label="Name"
              placeholder="Enter student name"
              {...form.getInputProps("name")}
            />
            <Select
              label="Class"
              placeholder="Select class"
              data={classes}
              {...form.getInputProps("class")}
            />
            <Select
              label="Gender"
              placeholder="Select gender"
              data={genders}
              disabled={editingStudent ? true : false}
              {...form.getInputProps("gender")}
            />
            <TextInput
              label="Roll No"
              placeholder="Enter roll number"
              disabled={editingStudent ? true : false}
              {...form.getInputProps("roll_no")}
            />
            <TextInput
              label="Phone No"
              placeholder="Enter phone number"
              {...form.getInputProps("phone_no")}
            />

            <Group justify="flex-start" mt="md">
              <Button type="submit" disabled={saving} loading={saving}>
                {editingStudent ? "Update" : "Add"}
              </Button>
            </Group>
          </form>
        </Modal>

        <Modal
          opened={vaccinateModalOpen}
          onClose={() => {
            setVaccinateModalOpen(false);
            setEditingStudent(null);
            vaccinateForm.reset();
          }}
          title={"Vaccinate Student"}
        >
          <form
            onSubmit={vaccinateForm.onSubmit(handleSubmitStudentVaccination)}
          >
            <NumberInput
              label="Drive ID"
              placeholder="Enter drive ID"
              {...vaccinateForm.getInputProps("drive_id")}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Vaccinate</Button>
            </Group>
          </form>
        </Modal>

        <Modal
          opened={modalOpenGeRep}
          onClose={() => {
            setModalOpenGeRep(false);
            setLink(null);
          }}
          title={"Generate Report"}
        >
          <Group justify="flex-end" mt="md">
            <Button
              onClick={handleClickGenerateRep}
              disabled={saving}
              loading={saving}
            >
              Generate Report
            </Button>
            {link && isResponseSuccess(link) && (
              <a
                href={(link as ImportRecordStatusResp)?.file.replace(
                  "minio-school",
                  "localhost"
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Report
              </a>
            )}
            {link && !isResponseSuccess(link) && (
              <Text c="red"> Failed to generate report</Text>
            )}
          </Group>
        </Modal>
      </Container>
    </div>
  );
};

export default StudentManagement;
