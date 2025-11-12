
import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Plus, 
  Search, 
  Trash2, 
  UserPlus 
} from "lucide-react";


import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Member } from "@/types/member.types";
import { MemberGrade } from "@/types";
import axios from "axios";
import { signUp } from "@/services/auth-service";
import { UserService } from "@/services/user.service";
import type { User } from "@/types/user.types";
import { useData } from "@/contexts/DataContext";
import supabase from "@/integrations/supabase/client";

  const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {  updateMember, deleteMember } = useData();
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Member | null;
    direction: 'ascending' | 'descending';
  }>({ key: null, direction: 'ascending' });

  const loadUsers = async () => {
  if (!user?.token) {
    console.error("No token found");
    return;
  }

  setLoading(true);
  try {
    const userData = await UserService.getAllUsers(user.token);
    setUsers(userData);
  } catch (error) {
    console.error(error);
    toast.error("Erro ao buscar usuários");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const fetchDepartments = async () => {
    const { data, error } = await supabase.from("departments").select("*");
    if (!error && data) setDepartments(data);
  };
  fetchDepartments();
}, []);


useEffect(() => {
  if (!authLoading && user?.token) {
    loadUsers();
  }
}, [user, authLoading]);

const admins = users.filter(u => u.role === "admin");
const regularUsers = users.filter(u => u.role === "user");

  // Formulário para novo membro
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "user" | "admin"; // ✅ restricts to the correct literal type
  department: string;
  cpf: string;
}

const [formData, setFormData] = useState<FormData>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "user",
  department: "",
  cpf: "",
});


  const requestSort = (key: keyof Member) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName: keyof Member) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Funções para lidar com os formulários
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      console.log(`Updating ${name}: ${value}`);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData
    });
  };

  const resetForm = () => {
    setFormData({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  cpf: "",
  role: "user",
  department:"" // Default
    });
  };

  // Adicionar um novo membro
const handleAddMember = async () => {
  const { first_name, last_name, email, password, role,department, cpf } = formData;

  if (!first_name || !last_name || !email || !password || !cpf) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  try {
    const newUser = await signUp(
      first_name,
      last_name,
      email,
      password,
      role,
      department, // or your department field if available
      cpf,
      user.token // ✅ admin token for authorization
    );

    if (newUser) {
      toast.success("Membro criado com sucesso!");
      resetForm();
      setAddDialogOpen(false);
      await loadUsers(); // refresh user list
    } else {
      toast.error("Erro ao criar membro.");
    }
  } catch (error) {
    toast.error("Erro ao criar membro. Verifique se o token é válido ou se há conflito no email.");
    console.error(error);
  }
};

const userById = React.useMemo(() => {
  const map = new Map();
  users.forEach(user => map.set(user.id, user));
  return map;
}, [users]);


  // Editar um membro existente
  const handleEditMember = async () => {
  if (!selectedMember) return;

  if (!formData.first_name || !formData.last_name || !formData.cpf ) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  try {
    // Await update to complete
    await updateMember(selectedMember.id, {
      first_name: formData.first_name,
      last_name: formData.last_name,
      cpf: formData.cpf,

    });

    toast.success("Membro atualizado com sucesso");
    
    // Refresh the members list (you need to expose this function outside useEffect)
    await loadUsers();

    setEditDialogOpen(false);
    setSelectedMember(null);
    resetForm();
  } catch (error) {
    toast.error("Erro ao atualizar membro");
    console.error(error);
  }
};


  // Excluir um membro
const handleDeleteMember = async () => {
  if (!selectedMember && !selectedUserId) return;

  try {
    if (selectedMember) {
      await UserService.deleteUser(selectedMember.id,user.token);
      toast.success("Membro excluído com sucesso");
    } else if (selectedUserId) {
      await UserService.deleteUser(selectedUserId,user.token);
      toast.success("Administrador excluído com sucesso");
    }

    await loadUsers(); // Refresh both lists
    setDeleteDialogOpen(false);
    setSelectedMember(null);
    setSelectedUserId(null);
  } catch (error) {
    console.log("Trying to delete ID:", selectedMember?.id || selectedUserId);
    toast.error("Erro ao excluir usuário");
    console.error(error);
  }
};



  // Preparar para editar um membro
  const handleEditDialogOpen = (member: User) => {
  setSelectedMember(member);
  setFormData({
    first_name: member.first_name,
    last_name: member.last_name,
    email: "",        // default or fetch if available
    password: "",     // keep empty for security
    cpf: member.cpf,
    role: "user",
    department: ""   // or use member.role if available
  });
  setEditDialogOpen(true);
};


  // Preparar para excluir um membro
  const handleDeleteDialogOpen = (member: User) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };


  // Editar um usuário administrador

  const [formPata, setFormPata] = useState({
  first_name: "",
  last_name: "",
  email: "",
  password: "", // keep if you're using it later
  cpf: "",
  grade: "",    // only used for members
  role: "admin", // member/admin
});

const handleEditAdminDialogOpen = (admin: User) => {
  setSelectedMember(null); // Clear member
  setSelectedUserId(admin.id); // <-- THIS is missing

  setFormPata({
    first_name: admin.first_name,
    last_name: admin.last_name,
    email: admin.email,
    password: "",       // optional
    cpf: admin.cpf || "",
    grade: "",          // not used for admins
    role: admin.role,
  });
console.log("Editing admin:", admin);

  setEditDialogOpen(true);
};

const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

const handleEditUser = async () => {
  if (!selectedUserId) return;

  // Validate fields
  if (!formPata.first_name || !formPata.last_name || !formPata.email) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  try {
    await UserService.updateUser(selectedUserId, {
      first_name: formPata.first_name,
      last_name: formPata.last_name,
      email: formPata.email,
      cpf: formPata.cpf,
    },user.token);
    toast.success("Administrador atualizado com sucesso");
    const refreshedUsers = await UserService.getAllUsers(user.token);
    setUsers(refreshedUsers);
    setEditDialogOpen(false);
    setSelectedUserId(null);
    resetFormPata();
  } catch (error) {
    toast.error("Erro ao atualizar administrador");
  }
};
const resetFormPata = () => {
  setFormPata({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cpf: "",
    grade: "",
    role: "admin",
  });
};

const handleConfirmEdit = () => {
  if (selectedMember) {
    handleEditMember();
  } else {
    handleEditUser();
  }
};


// Excluir um usuário administrador
const handleDeleteUser = async (userId: string) => {
  try {
    await UserService.deleteUser(userId,user.token);
    toast.success("Administrador excluído com sucesso");
    setDeleteDialogOpen(false);
  } catch (error) {
    toast.error("Erro ao excluir administrador");
  }
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestão de Parceiros</h1>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Novo Membro</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Membro</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo membro na plataforma.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="first_name" className="text-right">Nome</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="last_name" className="text-right">Sobrenome</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
                <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cpf" className="text-right">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>


      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">Role</Label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as "user" | "admin", // ✅ cast to proper type
            })
          }
          className="col-span-3 rounded-md border p-2"
        >
          <option value="user">User</option> 
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="department" className="text-right">Departamento</Label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="col-span-3 rounded-md border p-2"
          >
            <option value="">Selecione o departamento</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddMember}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
          <CardDescription>
            Gerencie todos os Parceiros cadastrados na plataforma.
          </CardDescription>
          
          <div className="flex items-center space-x-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, email ou CPF..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
      <CardContent>
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer">
            Nome
          </TableHead>
          <TableHead>Email</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {regularUsers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <UserPlus className="h-10 w-10 mb-2" />
                <p>Nenhum usuário encontrado</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          regularUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.cpf}</TableCell>
              <TableCell>{user.department || '—'}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditDialogOpen(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteDialogOpen(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
</CardContent>

      </Card>
      <Card className="mt-6">
  <CardHeader>
    <CardTitle>Administradores</CardTitle>
    <CardDescription>Usuários com funções administrativas na plataforma.</CardDescription>
  </CardHeader>

  <CardContent>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <UserPlus className="h-10 w-10 mb-2" />
                  <p>Nenhum administrador encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            admins.map(admin => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.first_name + " " + admin.last_name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{admin.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      handleEditAdminDialogOpen(admin);
                      setSelectedUserId(admin.id);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedUserId(admin.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  </CardContent>
</Card>
      
      {/* Diálogo de Edição */}
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Editar {selectedMember ? "Membro" : "Administrador"}</DialogTitle>
      <DialogDescription>
        Atualize os dados do {selectedMember ? "membro" : "administrador"} selecionado.
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      {/* Nome */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Nome</Label>
        <Input
          name="first_name"
          value={selectedMember ? formData.first_name : formPata.first_name}
          onChange={(e) =>
            selectedMember
              ? setFormData({ ...formData, first_name: e.target.value })
              : setFormPata({ ...formPata, first_name: e.target.value })
          }
        />
      </div>

      {/* Sobrenome */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Sobrenome</Label>
        <Input
          name="last_name"
          value={selectedMember ? formData.last_name : formPata.last_name}
          onChange={(e) =>
            selectedMember
              ? setFormData({ ...formData, last_name: e.target.value })
              : setFormPata({ ...formPata, last_name: e.target.value })
          }
        />
      </div>

      {/* CPF */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">CPF</Label>
        <Input
          name="cpf"
          value={selectedMember ? formData.cpf : formPata.cpf}
          onChange={(e) =>
            selectedMember
              ? setFormData({ ...formData, cpf: e.target.value })
              : setFormPata({ ...formPata, cpf: e.target.value })
          }
        />
      </div>


    </div>

    <DialogFooter>
      <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
        Cancelar
      </Button>
      <Button type="button" onClick={handleConfirmEdit}>
        Salvar Alterações
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      
      {/* Diálogo de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {selectedMember?.first_name+" "+selectedMember?.last_name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Se este membro tiver outros parceiros no seu squad, eles serão transferidos para o upline deste membro.
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteMember}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersPage;
