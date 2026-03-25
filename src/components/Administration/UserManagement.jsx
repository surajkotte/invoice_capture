import React, { useEffect, useState } from "react";
import { getusermanagement } from "../../adapter/Administration";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const UserManagement = () => {
  const [userdata, setUserData] = useState([]);
  const fetch_data = async () => {
    const response = await getusermanagement();
    if (response?.messageType == "S") {
      setUserData(response?.data);
    }
  };
  useEffect(() => {
    fetch_data();
  }, []);
  return (
    <Card>
      <div className="p-6">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Dashboard Autorization</TableHead>
                <TableHead>Configuration Authorization</TableHead>
                <TableHead>Upload Authorization</TableHead>
                <TableHead>Prompt Authorization</TableHead>
                <TableHead>Chat Authorization</TableHead>
                <TableHead>Analytics Authorization</TableHead>
                <TableHead>Usermanagement Authorization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userdata &&
                userdata?.length != 0 &&
                userdata?.map((data) => {
                  return (
                    <TableRow>
                      <TableCell>{data?.username}</TableCell>
                      <TableCell>{data?.email_address}</TableCell>
                      <TableCell>
                        <Checkbox />
                      </TableCell>

                      <TableCell>
                        <input
                          type="checkbox"
                          checked={data?.analytics === "Y"}
                          className="w-4 h-4 cursor-default"
                        />
                      </TableCell>

                      <TableCell>
                        <input
                          type="checkbox"
                          checked={data?.configuration === "Y"}
                          className="w-4 h-4 cursor-default"
                        />
                      </TableCell>

                      <TableCell>
                        <input
                          type="checkbox"
                          checked={data?.upload === "Y"}
                          className="w-4 h-4 cursor-default"
                        />
                      </TableCell>

                      <TableCell>
                        <input
                          type="checkbox"
                          checked={data?.prompt === "Y"}
                          className="w-4 h-4 cursor-default"
                        />
                      </TableCell>

                      <TableCell>
                        <input
                          type="checkbox"
                          checked={data?.chat === "Y"}
                          className="w-4 h-4 cursor-default"
                        />
                      </TableCell>

                      <TableCell>
                        <input
                          type="checkbox"
                          checked={data?.usermanagement === "Y"}
                          className="w-4 h-4 cursor-default"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default UserManagement;
