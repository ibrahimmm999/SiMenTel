import Button from "../../components/button";
import Paginate from "../../components/paginate";
import Table from "../../components/table";
import Textfield from "../../components/textfield";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/api";
import User from "../../interfaces/user";
import { toastError, toastSuccess } from "../../components/toast";
import Action from "../../components/action";
import Modal from "../../components/modal";
import Dropdown from "../../components/dropdown";
import Filter from "../../components/filter";
import { useNavigate } from "react-router-dom";

function DaftarUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (error) {
          throw new Error(`Error fetching user data: ${error.message}`);
        }

        if (data) {
          setUser(data);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        toastError(error as string);
      }
    };

    fetchUser();
  }, []);
  if (user?.role != "admin") {
    const navigator = useNavigate();
    navigator("/");
    toastError("Anda tidak punya izin");
    return;
  }

  const column = ["No", "Nama", "Email", "Kontak", "Role", "Action"];
  const [showEditPopUp, setShowEditPopUp] = useState<boolean>(false);
  const [showAddPopUp, setShowAddPopUp] = useState<boolean>(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);
  const [idSelected, setIdSelected] = useState<string>("");
  const [filtered, setFiltered] = useState<User[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const filterData = [
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" },
  ];

  const [search, setSearch] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [nama, setNama] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<{ label: string; value: string }>();

  const fetchUser = async () => {
    try {
      if ((await supabase.auth.getUser()).data.user == null) {
        throw "Not Authenticated";
      }

      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        throw `Error fetching user data: ${error.message}`;
      }

      if (data && data.length > 0) {
        var i = 0;
        var dataUser: User[] = data.map((e) => {
          i++;
          return {
            id: i.toString(),
            name: e.name,
            email: e.email,
            contact: e.contact,
            role: e.role,
            action: (
              <Action
                id={e.id}
                status={"WAITING"}
                onChangeEdit={(id) => {
                  setIdSelected(id);
                  setNama(data.filter((val: User) => val.id == id)[0].name);
                  setContact(
                    data.filter((val: User) => val.id == id)[0].contact
                  );
                  setRole({
                    label: data.filter((val: User) => val.id == id)[0].role,
                    value: data.filter((val: User) => val.id == id)[0].role,
                  });
                  setShowEditPopUp(true);
                }}
                onChangeDelete={(id) => {
                  setConfirm("");
                  setIdSelected(id);
                  setNama(data.filter((val: User) => val.id == id)[0].name);
                  setShowDeletePopUp(true);
                }}
              />
            ),
          };
        });
        setUsers(dataUser);
        setFiltered(dataUser);
        setFilter(filterData.map((val) => val.value));
      } else {
        toastError("Data User not found");
      }
    } catch (error) {
      toastError(error as string);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    setFiltered(users.filter((val: User) => filter.includes(val.role)));
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    setFiltered(
      users.filter(
        (val: User) =>
          val.name.toLowerCase().includes(search.toLowerCase()) ||
          val.email.toLowerCase().includes(search.toLowerCase()) ||
          val.contact.toLowerCase().includes(search.toLowerCase()) ||
          val.role.toLowerCase().includes(search.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [search]);

  const editUser = async () => {
    try {
      if ((await supabase.auth.getUser()).data.user == null) {
        throw "Not Authenticated";
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update({ name: nama, contact: contact, role: role?.value })
        .eq("id", idSelected)
        .select();
      if (data && data.length > 0) {
        fetchUser();
        toastSuccess("Edit User Successfully");
        setShowEditPopUp(false);
      }
      if (error) {
        throw error.message;
      }
    } catch (error) {
      toastError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const tambahUser = async () => {
    try {
      if ((await supabase.auth.getUser()).data.user == null) {
        throw "Not Authenticated";
      }

      if (password != confirmPassword) {
        throw "Password not match";
      }

      setIsLoading(true);
      const { data, error: err } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

      if (err) {
        throw err.message;
      }

      const { error } = await supabase.from("users").insert({
        id: data.user.id,
        email: email,
        role: role?.value,
        contact: contact,
        name: nama,
      });

      if (error) {
        throw error.message;
      }

      if (data && data.user != null) {
        fetchUser();
        toastSuccess("Create User Successfully");
        setShowAddPopUp(false);
      }
    } catch (error) {
      toastError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const hapusUser = async () => {
    try {
      if ((await supabase.auth.getUser()).data.user == null) {
        throw "Not Authenticated";
      }

      if (confirm != nama) {
        throw "Confirm type not match";
      }

      setIsLoading(true);
      const { data, error: err } = await supabase.auth.admin.deleteUser(
        idSelected
      );

      if (err) {
        throw err.message;
      }

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", idSelected);

      if (error) {
        throw error.message;
      }

      if (data && data.user != null) {
        fetchUser();
        toastSuccess("Delete User Successfully");
        setShowDeletePopUp(false);
      }
    } catch (error) {
      toastError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Modal
        visible={showDeletePopUp}
        onClose={() => setShowDeletePopUp(false)}
        children={
          <div>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Delete User
            </h1>
            <h1 className=" text-[16px] text-[#4D4C7D] mb-5 flex">
              Type <p className="font-bold mx-2"> {`"` + nama + `"`} </p> to
              delete the user
            </h1>
            <div className="flex w-full gap-2 mb-7 justify-center">
              <Textfield
                type="field"
                useLabel
                labelText="Confirm"
                placeholder="Masukkan Confirm Type"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-16 gap-4">
              <Button
                type="button"
                color="primary"
                text="Batalkan"
                onClick={() => setShowDeletePopUp(false)}
              />
              <Button
                isLoading={isLoading}
                type="submit"
                color="red"
                text="Hapus"
                onClick={hapusUser}
              />
            </div>
          </div>
        }
      ></Modal>

      <Modal
        visible={showEditPopUp}
        onClose={() => setShowEditPopUp(false)}
        children={
          <div>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Edit User
            </h1>
            <div className="flex w-full gap-2 mb-7">
              <div className="w-[50%]">
                <Textfield
                  type="field"
                  useLabel
                  labelText="Nama"
                  placeholder="Masukkan Nama"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="w-[50%]">
                <Textfield
                  type="field"
                  useLabel
                  labelText="Kontak"
                  placeholder="Masukkan Kontak"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>
            <div className="flex w-full gap-2 mb-7">
              <div className="w-[50%] max-h-full">
                <Dropdown
                  placeholder={"Masukkan Role"}
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Staff", value: "staff" },
                  ]}
                  useLabel
                  label="Role"
                  height="51.2px"
                  value={role}
                  onChange={(val) => setRole(val!)}
                />
              </div>
              <div className="w-[50%]"></div>
            </div>
            <div className="flex justify-end mt-16 gap-4">
              <Button
                type="button"
                color="red"
                text="Batalkan"
                onClick={() => setShowEditPopUp(false)}
              />
              <Button
                isLoading={isLoading}
                type="submit"
                color="green"
                text="Edit"
                onClick={editUser}
              />
            </div>
          </div>
        }
      ></Modal>

      <Modal
        visible={showAddPopUp}
        onClose={() => setShowAddPopUp(false)}
        children={
          <div>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Tambah User
            </h1>
            <div className="flex w-full gap-2 mb-7">
              <div className="w-[50%]">
                <Textfield
                  type="field"
                  useLabel
                  labelText="Nama"
                  placeholder="Masukkan Nama"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="w-[50%]">
                <Textfield
                  type="email"
                  useLabel
                  labelText="Email"
                  placeholder="Masukkan Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex w-full gap-2 mb-7">
              <div className="w-[50%] max-h-full">
                <Dropdown
                  placeholder={"Masukkan Role"}
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Staff", value: "staff" },
                  ]}
                  useLabel
                  label="Role"
                  height="51.2px"
                  value={role}
                  onChange={(val) => setRole(val!)}
                />
              </div>
              <div className="w-[50%] max-h-full">
                <Textfield
                  type="field"
                  useLabel
                  labelText="Kontak"
                  placeholder="Masukkan Kontak"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>
            <div className="flex w-full gap-2 mb-7">
              <div className="w-[50%] max-h-full">
                <Textfield
                  type="password"
                  useLabel
                  labelText="Password"
                  placeholder="Masukkan Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="w-[50%] max-h-full">
                <Textfield
                  type="password"
                  useLabel
                  labelText="Confirm Password"
                  placeholder="Masukkan Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-16 gap-4">
              <Button
                type="button"
                color="red"
                text="Batalkan"
                onClick={() => setShowAddPopUp(false)}
              />
              <Button
                isLoading={isLoading}
                type="submit"
                color="green"
                text="Tambah"
                onClick={tambahUser}
              />
            </div>
          </div>
        }
      ></Modal>

      <div className="w-full flex flex-col pb-10 bg-background min-h-screen pt-[120PX] px-4 xl:px-28 gap-12 items-center">
        <h1 className="text-[24px] md:text-[36px] xl:text-[64px] font-bold text-purple-primary text-center">
          DAFTAR USER
          <h2 className="text-[16px] md:text-[24px] xl:text-[36px] text-orange-primary">
            Jumlah Akun : {users.length}
          </h2>
        </h1>
        <div className="w-full md:w-[80%] xl:w-[50%] p-4 bg-white shadow-lg rounded-xl flex gap-4 flex-col md:flex-row">
          <div className="w-full h-36 md:w-1/2 md:h-52 bg-red-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
            <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">
              {users.filter((user) => user.role == "admin").length}
            </h1>
            <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">Admin</h2>
          </div>
          <div className="w-full h-36 md:w-1/2 md:h-52 bg-orange-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
            <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">
              {users.filter((user) => user.role == "staff").length}
            </h1>
            <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">Staff</h2>
          </div>
        </div>
        <div className="xl:px-[10%] w-full">
          <div className="flex justify-between xl:items-center mb-4 flex-col-reverse md:flex-row items-start gap-2 md:gap-0">
            <div className="flex gap-2">
              <Textfield
                type={"search"}
                placeholder={"Search"}
                onChange={(val) => setSearch(val.target.value)}
                value={search}
              />
              <Filter
                onSelected={(val) => setFilter(val)}
                selected={filter}
                data={filterData}
              />
            </div>
            <Button
              type={"button"}
              text="Add User"
              onClick={() => {
                setShowAddPopUp(true);
                setNama("");
                setContact("");
                setRole(undefined);
              }}
            />
          </div>
          <Table data={currentItems} header={column} isLoading={false} />
          <Paginate
            totalPages={users.length / 10}
            current={(curr: number) => setCurrentPage(curr)}
          />
        </div>
      </div>
    </>
  );
}

export default DaftarUser;
