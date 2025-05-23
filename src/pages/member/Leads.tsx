
import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Lead, LeadStatus, Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Search, Plus, FileEdit } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const LEAD_STATUS_MAP: Record<LeadStatus, string> = {
  "new": "Novo Lead",
  "contacted": "Primeiro Contato",
  "in-progress": "Em andamento",
  "negotiating": "Negociando",
  "closed": "Ganho",
  "lost": "Perdido"
};

const leadFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  source: z.string().min(1, "Origem é obrigatória"),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const MemberLeads: React.FC = () => {
  const { user } = useAuth();
  const { 
    getMemberActiveLeads, 
    getMemberClosedLeads, 
    getMemberLostLeads, 
    addLead 
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const activeLeads = getMemberActiveLeads(user?.id || "");
  const closedLeads = getMemberClosedLeads(user?.id || "");
  const lostLeads = getMemberLostLeads(user?.id || "");

  const leadForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      source: "",
    },
  });

  const handleSubmitLead = (values: LeadFormValues) => {
    if (!user) return;

    const success = addLead({
      name: values.name,
      phone: values.phone,
      source: values.source,
      status: "new",
      memberId: user.id,
      memberName: user.name,
    });

    if (success) {
      setIsAddDialogOpen(false);
      leadForm.reset();
    }
  };

  const filterLeads = (leads: Lead[]) => {
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredActiveLeads = filterLeads(activeLeads);
  const filteredClosedLeads = filterLeads(closedLeads);
  const filteredLostLeads = filterLeads(lostLeads);

  const LeadTable = ({ leads }: { leads: Lead[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            {leads === closedLeads && <TableHead>Valor da Venda</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={leads === closedLeads ? 6 : 5} className="h-24 text-center">
                Nenhum lead encontrado.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {LEAD_STATUS_MAP[lead.status]}
                  </span>
                </TableCell>
                <TableCell>
                  {lead.createdAt.toLocaleDateString("pt-BR")}
                </TableCell>
                {leads === closedLeads && (
                  <TableCell>
                    {lead.saleValue ? `R$ ${lead.saleValue.toFixed(2)}` : "N/A"}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Leads</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Leads</CardTitle>
          <CardDescription>
            Visualize e acompanhe todos os seus leads cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou origem..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Ativos ({activeLeads.length})</TabsTrigger>
              <TabsTrigger value="closed">Ganhos ({closedLeads.length})</TabsTrigger>
              <TabsTrigger value="lost">Perdidos ({lostLeads.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <LeadTable leads={filteredActiveLeads} />
            </TabsContent>
            <TabsContent value="closed" className="mt-4">
              <LeadTable leads={filteredClosedLeads} />
            </TabsContent>
            <TabsContent value="lost" className="mt-4">
              <LeadTable leads={filteredLostLeads} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
            <DialogDescription>
              Preencha as informações para cadastrar um novo lead no sistema.
            </DialogDescription>
          </DialogHeader>
          <Form {...leadForm}>
            <form onSubmit={leadForm.handleSubmit(handleSubmitLead)} className="space-y-4">
              <FormField
                control={leadForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={leadForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={leadForm.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Instagram, Facebook, Indicação, etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberLeads;
