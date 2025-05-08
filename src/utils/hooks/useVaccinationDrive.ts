import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ErrorRespObject, SuccessRespObject, VaccineDriveInfo } from "../types";
import React from "react";
import { vaccine_service_url } from "../urls";
import { unknownErrorObj } from "../constants";

interface UseDashboardDataResult {
  data: VaccineDriveInfo[];
  loading: boolean;
  error: string | null;
  addDrive: (
    drive: VaccineDriveInfo
  ) => Promise<SuccessRespObject<VaccineDriveInfo> | ErrorRespObject>;
  updateDrive: (
    drive: Partial<VaccineDriveInfo>
  ) => Promise<SuccessRespObject<VaccineDriveInfo> | ErrorRespObject>;
  saving: boolean;
  fetchData: () => Promise<void>;
}

const useVaccinationDrive = (): UseDashboardDataResult => {
  const [data, setData] = useState<VaccineDriveInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const addDrive = React.useCallback(async (drive: VaccineDriveInfo) => {
    setSaving(true);
    try {
      const response = await axios.post(
        `${vaccine_service_url}/vaccine/drives`,
        drive,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data as SuccessRespObject<VaccineDriveInfo>;
    } catch (error) {
      const err = error as AxiosError<ErrorRespObject>;
      if (!err.response?.data) {
        return unknownErrorObj;
      } else {
        return err.response.data as ErrorRespObject;
      }
    } finally {
      setSaving(false);
    }
  }, []);

  const updateDrive = React.useCallback(
    async (drive: Partial<VaccineDriveInfo>) => {
      setSaving(true);
      try {
        const response = await axios.patch(
          `${vaccine_service_url}/vaccine/drives`,
          drive,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data as SuccessRespObject<VaccineDriveInfo>;
      } catch (error) {
        const err = error as AxiosError<ErrorRespObject>;
        if (!err.response?.data) {
          return unknownErrorObj;
        } else {
          return err.response.data as ErrorRespObject;
        }
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8080/vaccine/drives");
      console.log("data:", response.data);
      setData(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    addDrive,
    updateDrive,
    saving,
    fetchData,
  };
};

export default useVaccinationDrive;
