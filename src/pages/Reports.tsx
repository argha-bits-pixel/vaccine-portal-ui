import { Card, Container, Loader, Pagination, Table } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { ImportRecordStatus } from "../utils/types";
import { student_service_url } from "../utils/urls";

const Reports: React.FC = () => {
  const [records, setRecords] = useState<ImportRecordStatus[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchReports = React.useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get(
        `${student_service_url}/bulk-upload?limit=${limit}&offset=${offset}`
      );
      setRecords(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div>
      <Header />
      <Container mt="md" size="lg">
        <Card shadow="sm" padding="xs">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>File</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Link</Table.Th>
                <Table.Th>Processed Records</Table.Th>
                <Table.Th>Total Records</Table.Th>
                <Table.Th>Request Type</Table.Th>
                <Table.Th>Error</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {records.map((rec) => (
                    <Table.Tr key={rec?.request_id}>
                      <Table.Td>{rec?.request_id}</Table.Td>
                      <Table.Td>{rec?.file_name}</Table.Td>
                      <Table.Td>{rec?.status}</Table.Td>
                      <Table.Td>
                        <a
                          href={rec?.file_path.replace(
                            "minio-school",
                            "localhost"
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download
                        </a>
                      </Table.Td>
                      <Table.Td>{rec?.processed_records}</Table.Td>
                      <Table.Td>{rec?.total_records}</Table.Td>
                      <Table.Td>{rec?.request_Type}</Table.Td>
                      <Table.Td>{rec?.error_message}</Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}
            </Table.Tbody>
          </Table>

          <Pagination
            total={Math.ceil(total / limit)}
            value={page}
            onChange={setPage}
            mt="md"
          />
        </Card>
      </Container>
    </div>
  );
};

export default Reports;
