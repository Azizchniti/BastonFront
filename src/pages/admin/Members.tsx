
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
  User, 
  UserPlus 
} from "lucide-react";
import { MemberService } from "@/services/members.service";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Member } from "@/types/member.types";
import { MemberGrade } from "@/types";

const gradeColors = {
  start: "bg-slate-500",
  standard: "bg-blue-500",
  gold: "bg-yellow-500",
  platinum: "bg-violet-500",
  diamond: "bg-emerald-500"
};

const gradeLabels = {
  start: "Start",
  standard: "Standard",
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond"
};

const MembersPage = () => {
const [members, setMembers] = useState<Member[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
  const { addMember, updateMember, deleteMember } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Member | null;
    direction: 'ascending' | 'descending';
  }>({ key: null, direction: 'ascending' });

  useEffect(() => {
  const loadMembers = async () => {
    try {
      const data = await MemberService.getAllMembers();
      setMembers(data);
    } catch (error) {
      toast.error("Erro ao buscar membros");
    } finally {
      setLoading(false);
    }
  };
  loadMembers();
}, []);


  // Formulário para novo membro
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    cpf: "",
    phone: "",
    grade: "",
    uplineId: "",
  });

  // Filtrar membros baseado na busca
  // const filteredMembers = members.filter(member => 
  //   // member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   // member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   member.cpf.includes(searchTerm)
  // );

  // Ordenar membros
  // const sortedMembers = React.useMemo(() => {
  //   let sortableMembers = [...filteredMembers];
  //   if (sortConfig.key !== null) {
  //     sortableMembers.sort((a, b) => {
  //       if (a[sortConfig.key!] < b[sortConfig.key!]) {
  //         return sortConfig.direction === 'ascending' ? -1 : 1;
  //       }
  //       if (a[sortConfig.key!] > b[sortConfig.key!]) {
  //         return sortConfig.direction === 'ascending' ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   return sortableMembers;
  // }, [filteredMembers, sortConfig]);

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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      uplineId: value
    });
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      cpf: "",
      phone: "",
      grade: "",
      uplineId: "",
    });
  };

  // Adicionar um novo membro
  const handleAddMember = () => {
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.cpf || !formData.phone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      addMember({
        first_name: formData.first_name,
        last_name: formData.last_name,
        cpf: formData.cpf,
        phone: formData.phone,
        upline_id: formData.uplineId || null,
        total_sales: 0,
        total_contacts: 0,
        total_commission: 0
      });
      setAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erro ao adicionar membro");
    }
  };

  // Editar um membro existente
  const handleEditMember = () => {
    if (!selectedMember) return;
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.cpf || !formData.phone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      updateMember(selectedMember.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        cpf: formData.cpf,
        phone: formData.phone,
        grade: formData.grade,
        upline_id: formData.uplineId || null,
      });
      setEditDialogOpen(false);
      setSelectedMember(null);
      resetForm();
    } catch (error) {
      toast.error("Erro ao atualizar membro");
    }
  };

  // Excluir um membro
  const handleDeleteMember = () => {
    if (!selectedMember) return;
    
    try {
      deleteMember(selectedMember.id);
      setDeleteDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      toast.error("Erro ao excluir membro");
    }
  };

  // Preparar para editar um membro
  const handleEditDialogOpen = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      first_name: member.first_name ,
      last_name: member.last_name,
      grade: member.grade,
      cpf: member.cpf,
      phone: member.phone,
      uplineId: member.upline_id || "",
    });
    setEditDialogOpen(true);
  };

  // Preparar para excluir um membro
  const handleDeleteDialogOpen = (member: Member) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestão de Membros</h1>
        
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
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpf" className="text-right">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="upline" className="text-right">
                  Upline
                </Label>
                <Select
                  value={formData.uplineId}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o upline" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Fixed: Changed empty string to "none" */}
                    <SelectItem value="none">Nenhum</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>
            Gerencie todos os membros cadastrados na plataforma.
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
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('first_name')}
                  >
                    <div className="flex items-center">
                      Nome
                      {getSortIcon('first_name')}
                    </div>
                  </TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('grade')}
                  >
                    <div className="flex items-center">
                      Graduação
                      {getSortIcon('grade')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort('total_sales')}
                  >
                    <div className="flex items-center justify-end">
                      Vendas (R$)
                      {getSortIcon('total_sales')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort('total_contacts')}
                  >
                    <div className="flex items-center justify-end">
                      Contatos
                      {getSortIcon('total_contacts')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <User className="h-10 w-10 mb-2" />
                        <p>Nenhum membro encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.first_name+" "+member.last_name}</TableCell>
                      <TableCell>{member.cpf}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <Badge className={`${gradeColors[member.grade]}`}>
                          {gradeLabels[member.grade]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(member.total_sales)}
                      </TableCell>
                      <TableCell className="text-right">{member.total_contacts}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditDialogOpen(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteDialogOpen(member)}
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
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>
              Atualize os dados do membro selecionado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nome
              </Label>
             <Input
                id="edit-first-name"
                name="first"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Sobrenome
              </Label>
              <Input
                id="edit-last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-cpf" className="text-right">
                CPF
              </Label>
              <Input
                id="edit-cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-upline" className="text-right">
                Upline
              </Label>
              <Select
                value={formData.uplineId}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o upline" />
                </SelectTrigger>
                <SelectContent>
                  {/* Fixed: Changed empty string to "none" */}
                  <SelectItem value="none">Nenhum</SelectItem>
                  {members
                    .filter(m => m.id !== selectedMember?.id)
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-grade" className="text-right">
              Grau
            </Label>
            <Select
              value={formData.grade}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, grade: value as MemberGrade }))
              }
            >
              <SelectTrigger className="col-span-3" id="edit-grade">
                <SelectValue placeholder="Selecione o grau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
              </SelectContent>
            </Select>
          </div>

          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditMember}>
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
              Se este membro tiver outros membros no seu squad, eles serão transferidos para o upline deste membro.
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
