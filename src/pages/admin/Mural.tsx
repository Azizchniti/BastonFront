
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  Clock, 
  File, 
  FileText, 
  Megaphone, 
  Pencil, 
  Plus, 
  Trash2,
  Calendar,
  UserCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { generateId } from "@/utils/dataUtils";

// Tipos de dados para comunicados e notícias
type AnnouncementType = "news" | "notice" | "announcement";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  publishDate: Date;
  expiryDate?: Date;
  isPublished: boolean;
  isHighlighted: boolean;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dados simulados para exemplo
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: generateId(),
    title: "Nova ferramenta disponível!",
    content: "Temos o prazer de anunciar que nossa nova ferramenta de gestão de vendas já está disponível para todos os membros. Esta ferramenta irá ajudar você a aumentar sua produtividade e organizar melhor suas oportunidades de vendas.",
    type: "news",
    publishDate: new Date(),
    isPublished: true,
    isHighlighted: true,
    authorId: "admin-1",
    authorName: "Administrador do Sistema",
    createdAt: new Date(Date.now() - 86400000), // 1 dia atrás
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    id: generateId(),
    title: "Lembrete: Reunião mensal",
    content: "Não esqueça da nossa reunião mensal que acontecerá na próxima quinta-feira às 15h. A presença de todos os membros é muito importante!",
    type: "notice",
    publishDate: new Date(),
    expiryDate: new Date(Date.now() + 604800000), // 7 dias no futuro
    isPublished: true,
    isHighlighted: false,
    authorId: "admin-1",
    authorName: "Administrador do Sistema",
    createdAt: new Date(Date.now() - 172800000), // 2 dias atrás
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    id: generateId(),
    title: "Atualização do sistema",
    content: "Informamos que o sistema estará indisponível para manutenção no próximo domingo, das 02:00 às 04:00. Pedimos desculpas pelo inconveniente.",
    type: "announcement",
    publishDate: new Date(),
    expiryDate: new Date(Date.now() + 259200000), // 3 dias no futuro
    isPublished: true,
    isHighlighted: true,
    authorId: "admin-1",
    authorName: "Administrador do Sistema",
    createdAt: new Date(Date.now() - 259200000), // 3 dias atrás
    updatedAt: new Date(Date.now() - 259200000)
  }
];

const typeLabels: Record<AnnouncementType, { label: string, icon: React.ElementType, color: string }> = {
  news: { 
    label: "Notícia", 
    icon: FileText, 
    color: "bg-green-100 text-green-800 border-green-300" 
  },
  notice: { 
    label: "Aviso", 
    icon: Megaphone, 
    color: "bg-yellow-100 text-yellow-800 border-yellow-300" 
  },
  announcement: { 
    label: "Comunicado", 
    icon: File, 
    color: "bg-blue-100 text-blue-800 border-blue-300" 
  }
};

const AdminMural: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    type: "news",
    publishDate: new Date(),
    expiryDate: undefined,
    isPublished: false,
    isHighlighted: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentAnnouncement({ ...currentAnnouncement, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCurrentAnnouncement({ ...currentAnnouncement, [name]: checked });
  };

  const handleAddOrUpdateAnnouncement = () => {
    if (!currentAnnouncement.title || !currentAnnouncement.content) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && currentAnnouncement.id) {
      // Update existing announcement
      setAnnouncements(announcements.map(a => 
        a.id === currentAnnouncement.id 
          ? { 
              ...a,
              ...currentAnnouncement,
              updatedAt: new Date()
            } as Announcement
          : a
      ));
      toast.success("Comunicado atualizado com sucesso!");
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: generateId(),
        title: currentAnnouncement.title || "",
        content: currentAnnouncement.content || "",
        type: currentAnnouncement.type as AnnouncementType || "news",
        publishDate: currentAnnouncement.publishDate || new Date(),
        expiryDate: currentAnnouncement.expiryDate,
        isPublished: currentAnnouncement.isPublished || false,
        isHighlighted: currentAnnouncement.isHighlighted || false,
        authorId: "admin-1", // Hardcoded for now
        authorName: "Administrador do Sistema", // Hardcoded for now
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setAnnouncements([...announcements, newAnnouncement]);
      toast.success("Comunicado criado com sucesso!");
    }
    
    resetForm();
    setDialogOpen(false);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement({
      ...announcement,
      publishDate: new Date(announcement.publishDate),
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate) : undefined
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Comunicado excluído com sucesso!");
  };

  const handleTogglePublish = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id
        ? { ...a, isPublished: !a.isPublished, updatedAt: new Date() }
        : a
    ));
    
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      toast.success(`Comunicado ${announcement.isPublished ? 'despublicado' : 'publicado'} com sucesso!`);
    }
  };

  const handleToggleHighlight = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id
        ? { ...a, isHighlighted: !a.isHighlighted, updatedAt: new Date() }
        : a
    ));
    
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      const action = announcement.isHighlighted ? 'removido dos' : 'adicionado aos';
      toast.success(`Comunicado ${action} destaques com sucesso!`);
    }
  };

  const resetForm = () => {
    setCurrentAnnouncement({
      title: "",
      content: "",
      type: "news",
      publishDate: new Date(),
      expiryDate: undefined,
      isPublished: false,
      isHighlighted: false
    });
    setIsEditing(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mural</h2>
        <p className="text-muted-foreground">
          Gerencie comunicados, notícias e avisos para os membros
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="news">Notícias</TabsTrigger>
              <TabsTrigger value="notice">Avisos</TabsTrigger>
              <TabsTrigger value="announcement">Comunicados</TabsTrigger>
              <TabsTrigger value="highlighted">Destacados</TabsTrigger>
            </TabsList>
            
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Editar Comunicado" : "Adicionar Novo Comunicado"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditing 
                      ? "Edite as informações do comunicado abaixo"
                      : "Preencha as informações para criar um novo comunicado."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Título
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      className="col-span-3"
                      placeholder="Título do comunicado"
                      value={currentAnnouncement.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <select
                      id="type"
                      name="type"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={currentAnnouncement.type}
                      onChange={(e) => setCurrentAnnouncement({
                        ...currentAnnouncement, 
                        type: e.target.value as AnnouncementType
                      })}
                    >
                      <option value="news">Notícia</option>
                      <option value="notice">Aviso</option>
                      <option value="announcement">Comunicado</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="content" className="text-right pt-2">
                      Conteúdo
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Conteúdo do comunicado"
                      className="col-span-3 min-h-[120px]"
                      value={currentAnnouncement.content}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="publishDate" className="text-right">
                      Data de Publicação
                    </Label>
                    <Input
                      id="publishDate"
                      name="publishDate"
                      type="datetime-local"
                      className="col-span-3"
                      value={currentAnnouncement.publishDate 
                        ? new Date(currentAnnouncement.publishDate)
                            .toISOString()
                            .slice(0, 16) 
                        : ""}
                      onChange={(e) => setCurrentAnnouncement({
                        ...currentAnnouncement, 
                        publishDate: new Date(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiryDate" className="text-right">
                      Data de Expiração
                    </Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="datetime-local"
                      className="col-span-3"
                      value={currentAnnouncement.expiryDate 
                        ? new Date(currentAnnouncement.expiryDate)
                            .toISOString()
                            .slice(0, 16) 
                        : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCurrentAnnouncement({
                          ...currentAnnouncement, 
                          expiryDate: value ? new Date(value) : undefined
                        });
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Publicado</Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        checked={currentAnnouncement.isPublished}
                        onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
                      />
                      <Label>
                        {currentAnnouncement.isPublished ? "Sim" : "Não"}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Destacado</Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        checked={currentAnnouncement.isHighlighted}
                        onCheckedChange={(checked) => handleSwitchChange("isHighlighted", checked)}
                      />
                      <Label>
                        {currentAnnouncement.isHighlighted ? "Sim" : "Não"}
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    resetForm();
                    setDialogOpen(false);
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddOrUpdateAnnouncement}>
                    {isEditing ? "Atualizar" : "Adicionar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <RenderAnnouncements 
              announcements={announcements} 
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onTogglePublish={handleTogglePublish}
              onToggleHighlight={handleToggleHighlight}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="news" className="space-y-4">
            <RenderAnnouncements 
              announcements={announcements.filter(a => a.type === 'news')} 
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onTogglePublish={handleTogglePublish}
              onToggleHighlight={handleToggleHighlight}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="notice" className="space-y-4">
            <RenderAnnouncements 
              announcements={announcements.filter(a => a.type === 'notice')} 
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onTogglePublish={handleTogglePublish}
              onToggleHighlight={handleToggleHighlight}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="announcement" className="space-y-4">
            <RenderAnnouncements 
              announcements={announcements.filter(a => a.type === 'announcement')} 
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onTogglePublish={handleTogglePublish}
              onToggleHighlight={handleToggleHighlight}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="highlighted" className="space-y-4">
            <RenderAnnouncements 
              announcements={announcements.filter(a => a.isHighlighted)} 
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onTogglePublish={handleTogglePublish}
              onToggleHighlight={handleToggleHighlight}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface RenderAnnouncementsProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onToggleHighlight: (id: string) => void;
  formatDate: (date: Date | undefined) => string;
}

const RenderAnnouncements: React.FC<RenderAnnouncementsProps> = ({
  announcements,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleHighlight,
  formatDate,
}) => {
  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Nenhum comunicado encontrado</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Crie um novo comunicado clicando no botão acima.
        </p>
      </div>
    );
  }
  
  return (
    <>
      {announcements.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((announcement) => {
        const TypeIcon = typeLabels[announcement.type].icon;
        
        return (
          <Card key={announcement.id} className={`border-l-4 ${announcement.isHighlighted ? 'border-l-primary' : 'border-l-border'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-center">
                  <Badge className={typeLabels[announcement.type].color}>
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {typeLabels[announcement.type].label}
                  </Badge>
                  {announcement.isHighlighted && (
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      Destacado
                    </Badge>
                  )}
                </div>
                <div className="space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onToggleHighlight(announcement.id)}
                    title={announcement.isHighlighted ? "Remover destaque" : "Destacar"}
                  >
                    {announcement.isHighlighted ? (
                      <Megaphone className="h-4 w-4" />
                    ) : (
                      <Megaphone className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onTogglePublish(announcement.id)}
                    title={announcement.isPublished ? "Despublicar" : "Publicar"}
                  >
                    {announcement.isPublished ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(announcement)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(announcement.id)}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl mt-2">{announcement.title}</CardTitle>
              
              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Publicado em: {formatDate(announcement.publishDate)}
                </div>
                {announcement.expiryDate && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Expira em: {formatDate(announcement.expiryDate)}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-sm whitespace-pre-line">
                {announcement.content}
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <UserCircle className="h-3 w-3 mr-1" />
                  Por {announcement.authorName}
                </div>
                <div>
                  Última atualização: {formatDate(announcement.updatedAt)}
                </div>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
};

export default AdminMural;
