import React, { useEffect, useState } from "react";
import {
  getusermanagement,
  updateUserManagement,
} from "../../adapter/Administration";
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
import { Button } from "@/components/ui/button";
import { Save, Plus } from "lucide-react";
import { useToast } from "../Hooks/useToastHook";
import CreateNewUser from "./CreateNewUser";
const UserManagement = () => {
  const [userdata, setUserData] = useState([]);
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const fetch_data = async () => {
    const response = await getusermanagement();
    if (response?.messageType === "S") {
      setUserData(response?.data);
      setModifiedUsers({});
    }
  };

  const change_data = (id, fieldid, value) => {
    const newValue = value === "X" ? null : "X";
    setUserData((prevData) =>
      prevData.map((user) => {
        if (user.id === id) {
          return { ...user, [fieldid]: newValue };
        }
        return user;
      }),
    );
    setModifiedUsers((prevModified) => {
      const baseUser = userdata.find((u) => u.id === id);
      return {
        ...prevModified,
        [id]: {
          ...(prevModified[id] || baseUser),
          [fieldid]: newValue,
        },
      };
    });
  };
  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };
  const handleSave = async () => {
    const changesToSubmit = Object.values(modifiedUsers);
    if (changesToSubmit.length === 0) {
      toast({
        title: "Nothing to save",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const response = await updateUserManagement(changesToSubmit);
      if (response?.messageType === "S") {
        toast({
          title: "Saved successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Unable to Save data, Please contact system administrator",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: error?.message,
        variant: "default",
      });
    } finally {
      setModifiedUsers({});
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);
  return (
    <>
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{userdata?.length || 0}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <Button
                variant="destructive"
                onClick={handleSave}
                disabled={Object.keys(modifiedUsers).length === 0 || isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="default" onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">User Name</TableHead>
                  <TableHead className="text-center">Email Address</TableHead>
                  <TableHead className="text-center">
                    Dashboard Autorization
                  </TableHead>
                  <TableHead className="text-center">
                    Configuration Authorization
                  </TableHead>
                  <TableHead className="text-center">
                    Upload Authorization
                  </TableHead>
                  <TableHead className="text-center">
                    Prompt Authorization
                  </TableHead>
                  <TableHead className="text-center">
                    Chat Authorization
                  </TableHead>
                  <TableHead className="text-center">
                    Analytics Authorization
                  </TableHead>
                  <TableHead className="text-center">Show Queue</TableHead>
                  <TableHead className="text-center">Edit Queue</TableHead>
                  <TableHead className="text-center">
                    Usermanagement Authorization
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userdata &&
                  userdata?.length != 0 &&
                  userdata?.map((data) => {
                    return (
                      <TableRow key={data?.id}>
                        <TableCell>{data?.username}</TableCell>
                        <TableCell>{data?.email_address}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            id={"dashboard"}
                            checked={data?.dashboard ? true : false}
                            onCheckedChange={() =>
                              change_data(data.id, "dashboard", data?.dashboard)
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <Checkbox
                            id={"configurtion"}
                            checked={data?.configuration ? true : false}
                            onCheckedChange={() =>
                              change_data(
                                data.id,
                                "configuration",
                                data?.configuration,
                              )
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <Checkbox
                            id={"upload"}
                            checked={data?.upload ? true : false}
                            onCheckedChange={() =>
                              change_data(data.id, "upload", data?.upload)
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <Checkbox
                            id={"prompt"}
                            checked={data?.prompt ? true : false}
                            onCheckedChange={() =>
                              change_data(data.id, "prompt", data?.prompt)
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <Checkbox
                            id={"chat"}
                            checked={data?.chat ? true : false}
                            onCheckedChange={() =>
                              change_data(data.id, "chat", data?.chat)
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <Checkbox
                            id={"analytics"}
                            checked={data?.analytics ? true : false}
                            onCheckedChange={() =>
                              change_data(data.id, "analytics", data?.analytics)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            id={"getqueue"}
                            checked={data?.getqueue ? true : false}
                            onCheckedChange={() =>
                              change_data(data.id, "getqueue", data?.getqueue)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            id={"updatequeue"}
                            checked={data?.updatequeue ? true : false}
                            onCheckedChange={() =>
                              change_data(data.id, "updatequeue", data?.updatequeue)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            id={"usermanagement"}
                            checked={data?.usermanagement ? true : false}
                            onCheckedChange={() =>
                              change_data(
                                data.id,
                                "usermanagement",
                                data?.usermanagement,
                              )
                            }
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
      <CreateNewUser
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetch_data} // Refreshes the table automatically when a user is added!
      />
    </>
  );
};

export default UserManagement;
