import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Video, 
  Plus, 
  Pencil, 
  Trash2, 
  Book, 
  ArrowRight, 
  CheckCircle2, 
  Play
} from "lucide-react";
import { generateId } from "@/utils/dataUtils";
import { EducationService } from "@/services/EducationService";
import { Course, Class, Certification, LearningPath } from "@/types/education.types";



const MemberGraduation: React.FC = () => {
 const [courses, setCourses] = useState<Course[]>([]);
 const [classes, setClasses] = useState<Class[]>([]);
 const [certifications, setCertifications] = useState<Certification[]>([]);
 const [paths, setPaths] = useState<LearningPath[]>([]);
 
 
 useEffect(() => {
   EducationService.getCourses().then(setCourses);
   EducationService.getClasses().then(setClasses);
   EducationService.getCertifications().then(setCertifications);
   EducationService.getPaths().then(setPaths);
 }, []);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: "",
    description: "",
    classes: [],
    duration: 0
  });

  const [newClass, setNewClass] = useState<Partial<Class>>({
    title: "",
    description: "",
    video_url: "",
    duration: 0,
    materials: []
  });

  const [newCertification, setNewCertification] = useState<Partial<Certification>>({
    title: "",
    description: "",
    required_courses: [],
    max_attempts: 3
  });

  const [newPath, setNewPath] = useState<Partial<LearningPath>>({
    title: "",
    description: "",
    steps: []
  });

  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [isEditingCertification, setIsEditingCertification] = useState(false);
  const [isEditingPath, setIsEditingPath] = useState(false);

  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [pathDialogOpen, setPathDialogOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseClasses, setSelectedCourseClasses] = useState<Class[]>([]);
  const [currentClassIndex, setCurrentClassIndex] = useState<number>(0);

  // Funções para gerenciar cursos
  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditingCourse && newCourse.id) {
      setCourses(courses.map(course => 
        course.id === newCourse.id ? { ...course, ...newCourse, updatedAt: new Date() } as Course : course
      ));
      toast.success("Curso atualizado com sucesso!");
    } else {
      const course: Course = {
        ...newCourse as Omit<Course, "id" | "type" | "createdAt" | "updatedAt">,
        id: generateId(),
       
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCourses([...courses, course]);
      toast.success("Curso adicionado com sucesso!");
    }
    
    setNewCourse({
      title: "",
      description: "",
      classes: [],
      duration: 0
    });
    setCourseDialogOpen(false);
    setIsEditingCourse(false);
  };

  const handleEditCourse = (course: Course) => {
    setNewCourse(course);
    setIsEditingCourse(true);
    setCourseDialogOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("Curso excluído com sucesso!");
  };

  // Funções para gerenciar aulas
  const handleAddClass = () => {
    if (!newClass.title || !newClass.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditingClass && newClass.id) {
      setClasses(classes.map(cls => 
        cls.id === newClass.id ? { ...cls, ...newClass, updatedAt: new Date() } as Class : cls
      ));
      toast.success("Aula atualizada com sucesso!");
    } else {
      const cls: Class = {
        ...newClass as Omit<Class, "id" | "type" | "createdAt" | "updatedAt">,
        id: generateId(),
       
        materials: newClass.materials || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setClasses([...classes, cls]);
      toast.success("Aula adicionada com sucesso!");
    }
    
    setNewClass({
      title: "",
      description: "",
      video_url: "",
      duration: 0,
      materials: []
    });
    setClassDialogOpen(false);
    setIsEditingClass(false);
  };

  const handleEditClass = (cls: Class) => {
    setNewClass(cls);
    setIsEditingClass(true);
    setClassDialogOpen(true);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(cls => cls.id !== id));
    toast.success("Aula excluída com sucesso!");
  };

  // Funções para gerenciar certificações
  const handleAddCertification = () => {
    if (!newCertification.title || !newCertification.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditingCertification && newCertification.id) {
      setCertifications(certifications.map(cert => 
        cert.id === newCertification.id ? { ...cert, ...newCertification, updatedAt: new Date() } as Certification : cert
      ));
      toast.success("Certificação atualizada com sucesso!");
    } else {
      const certification: Certification = {
        ...newCertification as Omit<Certification, "id" | "type" | "createdAt" | "updatedAt">,
        id: generateId(),
        required_courses: newCertification.required_courses || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCertifications([...certifications, certification]);
      toast.success("Certificação adicionada com sucesso!");
    }
    
    setNewCertification({
      title: "",
      description: "",
      required_courses: [],
      max_attempts: 3
    });
    setCertificationDialogOpen(false);
    setIsEditingCertification(false);
  };

  const handleEditCertification = (cert: Certification) => {
    setNewCertification(cert);
    setIsEditingCertification(true);
    setCertificationDialogOpen(true);
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    toast.success("Certificação excluída com sucesso!");
  };

  // Funções para gerenciar trilhas
const handleAddPath = async () => {
  if (!newPath.title || !newPath.description) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  try {
    if (isEditingPath && newPath.id) {
      const updatedPath = {
        ...newPath,
        updatedAt: new Date()
      };

      await EducationService.updatePath(newPath.id, updatedPath);
      setPaths(paths.map(path =>
        path.id === newPath.id ? updatedPath as LearningPath : path
      ));
      toast.success("Trilha atualizada com sucesso!");
    } else {
      const createdPath = await EducationService.createPath({
        ...newPath,
        steps: newPath.steps || []
      });

      setPaths([...paths, createdPath]);
      toast.success("Trilha adicionada com sucesso!");
    }

    // Reset form
    setNewPath({
      title: "",
      description: "",
      steps: []
    });
    setPathDialogOpen(false);
    setIsEditingPath(false);

  } catch (error: any) {
    console.error("Erro ao salvar trilha:", error);
    toast.error("Erro ao salvar trilha");
  }
};


  const handleEditPath = (path: LearningPath) => {
    setNewPath(path);
    setIsEditingPath(true);
    setPathDialogOpen(true);
  };

  const handleDeletePath = (id: string) => {
    setPaths(paths.filter(path => path.id !== id));
    toast.success("Trilha excluída com sucesso!");
  };

  // Helper para obter nomes de cursos para exibição em trilhas e certificações
  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Curso não encontrado";
  };
  function getEmbedUrl(url: string): string {
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  } else {
    return url; // Direct video URL like .mp4 or other
  }
};
  const handleViewCourse = async (course: Course) => {
  try {
    setSelectedCourse(course);
    if (course.classes && course.classes.length > 0) {
      const classList = await EducationService.getClassesByIds(course.classes);
      setSelectedCourseClasses(classList);
      setCurrentClassIndex(0); // Show the first class initially
    } else {
      setSelectedCourseClasses([]);
    }
  } catch (err) {
    toast.error("Erro ao carregar aulas do curso");
  }
};
function isVideoUrl(url: string): boolean {
  return (
    url.includes("youtube.com/watch?v=") ||
    url.includes("youtu.be/") ||
    url.includes("vimeo.com/") ||
    url.toLowerCase().endsWith(".mp4")
  );
}


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Graduação</h2>
        <p className="text-muted-foreground">
          Gerencie os conteúdos educacionais para a graduação dos membros
        </p>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">
            <BookOpen className="mr-2 h-4 w-4" />
            Cursos
          </TabsTrigger>
          {/* <TabsTrigger value="certifications">
            <GraduationCap className="mr-2 h-4 w-4" />
            Certificações
          </TabsTrigger> */}
          <TabsTrigger value="paths">
            <Book className="mr-2 h-4 w-4" />
            Trilhas
          </TabsTrigger>
        </TabsList>

        {/* Cursos */}
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Cursos</CardTitle>
              <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                <DialogTrigger asChild>
                  {/* <Button onClick={() => {
                    setNewCourse({
                      title: "",
                      description: "",
                      classes: [],
                      duration: 0
                    });
                    setIsEditingCourse(false);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Curso
                  </Button> */}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditingCourse ? "Editar Curso" : "Adicionar Curso"}</DialogTitle>
                    <DialogDescription>
                      {isEditingCourse 
                        ? "Edite as informações do curso abaixo"
                        : "Preencha as informações para criar um novo curso."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        placeholder="Título do curso"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descrição do curso"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duração (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="Duração do curso em minutos"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({
                          ...newCourse, 
                          duration: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Aulas</Label>
                      <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                        {classes.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nenhuma aula disponível</p>
                        ) : (
                          classes.map(cls => (
                            <div key={cls.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`class-${cls.id}`}
                                checked={(newCourse.classes || []).includes(cls.id)}
                                onChange={(e) => {
                                  const updatedClasses = e.target.checked
                                    ? [...(newCourse.classes || []), cls.id]
                                    : (newCourse.classes || []).filter(id => id !== cls.id);
                                  setNewCourse({...newCourse, classes: updatedClasses});
                                }}
                              />
                              <label htmlFor={`class-${cls.id}`} className="text-sm">{cls.title}</label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddCourse}>{isEditingCourse ? "Salvar" : "Adicionar"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Aulas</TableHead>
                     <TableHead className="w-[120px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <p className="text-muted-foreground">Nenhum curso cadastrado</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{course.description}</TableCell>
                          <TableCell>{course.duration} min</TableCell>
                          <TableCell>{course.classes.length} aulas</TableCell>
                         <div className="flex items-center space-x-2">
                             <Button variant="ghost" size="icon" onClick={() => handleViewCourse(course)}>
                              <Play className="h-4 w-4" />
                              <span className="sr-only">Visualizar</span>
                            </Button>
                         </div>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
            {selectedCourse && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>{selectedCourse.title} - Aulas</CardTitle>
                      <CardDescription>{selectedCourse.description}</CardDescription>
                    </CardHeader>
                  <CardContent>
                  {selectedCourseClasses.length === 0 ? (
                    <p className="text-muted-foreground">Este curso não possui aulas.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left side: class list */}
                      <div className="space-y-2">
                        {selectedCourseClasses.map((cls, index) => (
                          <Button
                            key={cls.id}
                            variant={index === currentClassIndex ? "default" : "outline"}
                            onClick={() => setCurrentClassIndex(index)}
                            className="w-full justify-start"
                          >
                            {cls.title}
                          </Button>
                        ))}
                      </div>
          
                      {/* Middle: video player or link */}
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold">
                          {selectedCourseClasses[currentClassIndex]?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedCourseClasses[currentClassIndex]?.description}
                        </p>
          
                        {(() => {
                          const url = selectedCourseClasses[currentClassIndex]?.video_url;
                          if (!url) {
                            return <p className="text-sm text-muted-foreground">Sem recurso</p>;
                          }
          
                    if (isVideoUrl(url)) {
                      // Only show iframe if it's a video
                      return (
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={getEmbedUrl(url)}
                            title="Vídeo da aula"
                            frameBorder="0"
                            allowFullScreen
                            className="w-full h-full rounded-md"
                          />
                        </div>
                      );
                    }
          
                    // Otherwise, just show clickable URL
                    return (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-block mt-2
                        text-primary hover:text-primary-dark
                        underline
                        break-words
                        max-w-full
                        truncate
                        hover:underline
                        transition
                        cursor-pointer
                      "
                      title={url} // shows full URL on hover
                    >
                      {url}
                    </a>
                  );
          
                  })()}
                </div>
              </div>
            )}
          </CardContent>
         </Card>
       )}
       
               </TabsContent>

        {/* Aulas */}
        <TabsContent value="classes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Aulas</CardTitle>
              <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                <DialogTrigger asChild>
                  {/* <Button onClick={() => {
                    setNewClass({
                      title: "",
                      description: "",
                      videoUrl: "",
                      duration: 0,
                      materials: []
                    });
                    setIsEditingClass(false);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Aula
                  </Button> */}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditingClass ? "Editar Aula" : "Adicionar Aula"}</DialogTitle>
                    <DialogDescription>
                      {isEditingClass 
                        ? "Edite as informações da aula abaixo"
                        : "Preencha as informações para criar uma nova aula."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        placeholder="Título da aula"
                        value={newClass.title}
                        onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descrição da aula"
                        value={newClass.description}
                        onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="videoUrl">URL do Vídeo</Label>
                      <Input
                        id="videoUrl"
                        placeholder="URL do vídeo da aula"
                        value={newClass.video_url}
                        onChange={(e) => setNewClass({...newClass, video_url: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duração (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="Duração da aula em minutos"
                        value={newClass.duration}
                        onChange={(e) => setNewClass({
                          ...newClass, 
                          duration: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="materials">Materiais (URLs separados por vírgula)</Label>
                      <Input
                        id="materials"
                        placeholder="URLs dos materiais"
                        value={(newClass.materials || []).join(", ")}
                        onChange={(e) => setNewClass({
                          ...newClass, 
                          materials: e.target.value.split(",").map(url => url.trim()).filter(url => url)
                        })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setClassDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddClass}>{isEditingClass ? "Salvar" : "Adicionar"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Vídeo</TableHead>
                      <TableHead>Materiais</TableHead>
                  
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          <p className="text-muted-foreground">Nenhuma aula cadastrada</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      classes.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell className="font-medium">{cls.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{cls.description}</TableCell>
                          <TableCell>{cls.duration} min</TableCell>
                         <TableCell className="max-w-sm">
  {cls.video_url ? (
    <div className="aspect-video w-full">
      <iframe
        src={getEmbedUrl(cls.video_url)}
        title="Vídeo da aula"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-md"
      ></iframe>
    </div>
  ) : (
    "Sem vídeo"
  )}
</TableCell>

                          <TableCell>
                            {cls.materials.length > 0 ? 
                              `${cls.materials.length} material(is)` : 
                              "Sem materiais"
                            }
                          </TableCell>
                  
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificações */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Certificações</CardTitle>
              <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
                <DialogTrigger asChild>
                  {/* <Button onClick={() => {
                    setNewCertification({
                      title: "",
                      description: "",
                      requiredCourses: [],
                      maxAttempts: 3
                    });
                    setIsEditingCertification(false);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Certificação
                  </Button> */}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditingCertification ? "Editar Certificação" : "Adicionar Certificação"}</DialogTitle>
                    <DialogDescription>
                      {isEditingCertification 
                        ? "Edite as informações da certificação abaixo"
                        : "Preencha as informações para criar uma nova certificaç��o."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        placeholder="Título da certificação"
                        value={newCertification.title}
                        onChange={(e) => setNewCertification({...newCertification, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descrição da certificação"
                        value={newCertification.description}
                        onChange={(e) => setNewCertification({...newCertification, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxAttempts">Número Máximo de Tentativas</Label>
                      <Input
                        id="maxAttempts"
                        type="number"
                        placeholder="Número máximo de tentativas"
                        value={newCertification.max_attempts}
                        onChange={(e) => setNewCertification({
                          ...newCertification, 
                          max_attempts: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Cursos Necessários</Label>
                      <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                        {courses.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nenhum curso disponível</p>
                        ) : (
                          courses.map(course => (
                            <div key={course.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`cert-course-${course.id}`}
                                checked={(newCertification.required_courses || []).includes(course.id)}
                                onChange={(e) => {
                                  const updatedCourses = e.target.checked
                                    ? [...(newCertification.required_courses || []), course.id]
                                    : (newCertification.required_courses || []).filter(id => id !== course.id);
                                  setNewCertification({...newCertification, required_courses: updatedCourses});
                                }}
                              />
                              <label htmlFor={`cert-course-${course.id}`} className="text-sm">{course.title}</label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCertificationDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddCertification}>{isEditingCertification ? "Salvar" : "Adicionar"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tentativas Máx.</TableHead>
                      <TableHead>Cursos Necessários</TableHead>
                 
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <p className="text-muted-foreground">Nenhuma certificação cadastrada</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      certifications.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium">{cert.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{cert.description}</TableCell>
                          <TableCell>{cert.max_attempts}</TableCell>
                          <TableCell>
                            {cert.required_courses.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {cert.required_courses.map(courseId => (
                                  <li key={courseId} className="text-sm">{getCourseTitle(courseId)}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-muted-foreground">Nenhum curso necessário</span>
                            )}
                          </TableCell>
      
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trilhas */}
        <TabsContent value="paths">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Trilhas de Aprendizado</CardTitle>
              <Dialog open={pathDialogOpen} onOpenChange={setPathDialogOpen}>
                <DialogTrigger asChild>
                  {/* <Button onClick={() => {
                    setNewPath({
                      title: "",
                      description: "",
                      steps: []
                    });
                    setIsEditingPath(false);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Trilha
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{isEditingPath ? "Editar Trilha" : "Adicionar Trilha"}</DialogTitle>
                    <DialogDescription>
                      {isEditingPath 
                        ? "Edite as informações da trilha abaixo"
                        : "Preencha as informações para criar uma nova trilha de aprendizado."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        placeholder="Título da trilha"
                        value={newPath.title}
                        onChange={(e) => setNewPath({...newPath, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descrição da trilha"
                        value={newPath.description}
                        onChange={(e) => setNewPath({...newPath, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Passos da Trilha</Label>
                      <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
                        <div className="space-y-4">
                          <p className="text-sm font-medium mb-2">Cursos</p>
                          {courses.map((course, index) => (
                            <div key={course.id} className="flex items-center space-x-3 pb-2 border-b">
                              <input
                                type="checkbox"
                                id={`path-course-${course.id}`}
                                checked={(newPath.steps || [])
                                  .some(step => step.contentId === course.id && step.contentType === 'course')}
                                onChange={(e) => {
                                  const updatedSteps = [...(newPath.steps || [])];
                                  
                                  if (e.target.checked) {
                                    // Add to steps if not already present
                                    if (!updatedSteps.some(step => step.contentId === course.id)) {
                                      updatedSteps.push({
                                        contentId: course.id,
                                        contentType: 'course',
                                        order: updatedSteps.length + 1
                                      });
                                    }
                                  } else {
                                    // Remove from steps
                                    const index = updatedSteps.findIndex(step => 
                                      step.contentId === course.id && step.contentType === 'course'
                                    );
                                    if (index !== -1) {
                                      updatedSteps.splice(index, 1);
                                      // Reorder remaining steps
                                      updatedSteps.forEach((step, i) => {
                                        step.order = i + 1;
                                      });
                                    }
                                  }
                                  
                                  setNewPath({...newPath, steps: updatedSteps});
                                }}
                              />
                              <label htmlFor={`path-course-${course.id}`} className="text-sm flex-1">{course.title}</label>
                              {(newPath.steps || []).some(step => step.contentId === course.id) && (
                                <div className="flex items-center">
                                  <span className="text-xs bg-muted rounded-md px-2 py-1">
                                    Ordem: {
                                      (newPath.steps || [])
                                        .find(step => step.contentId === course.id)?.order || 0
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}

                          <p className="text-sm font-medium mt-4 mb-2">Certificações</p>
                          {certifications.map((cert) => (
                            <div key={cert.id} className="flex items-center space-x-3 pb-2 border-b">
                              <input
                                type="checkbox"
                                id={`path-cert-${cert.id}`}
                                checked={(newPath.steps || [])
                                  .some(step => step.contentId === cert.id && step.contentType === 'certification')}
                                onChange={(e) => {
                                  const updatedSteps = [...(newPath.steps || [])];
                                  
                                  if (e.target.checked) {
                                    // Add to steps if not already present
                                    if (!updatedSteps.some(step => step.contentId === cert.id)) {
                                      updatedSteps.push({
                                        contentId: cert.id,
                                        contentType: 'certification',
                                        order: updatedSteps.length + 1
                                      });
                                    }
                                  } else {
                                    // Remove from steps
                                    const index = updatedSteps.findIndex(step => 
                                      step.contentId === cert.id && step.contentType === 'certification'
                                    );
                                    if (index !== -1) {
                                      updatedSteps.splice(index, 1);
                                      // Reorder remaining steps
                                      updatedSteps.forEach((step, i) => {
                                        step.order = i + 1;
                                      });
                                    }
                                  }
                                  
                                  setNewPath({...newPath, steps: updatedSteps});
                                }}
                              />
                              <label htmlFor={`path-cert-${cert.id}`} className="text-sm flex-1">{cert.title}</label>
                              {(newPath.steps || []).some(step => step.contentId === cert.id) && (
                                <div className="flex items-center">
                                  <span className="text-xs bg-muted rounded-md px-2 py-1">
                                    Ordem: {
                                      (newPath.steps || [])
                                        .find(step => step.contentId === cert.id)?.order || 0
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPathDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddPath}>{isEditingPath ? "Salvar" : "Adicionar"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paths.length === 0 ? (
                  <div className="text-center py-8 border rounded-md">
                    <Book className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">Nenhuma trilha cadastrada</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Crie uma nova trilha para organizar cursos e certificações.
                    </p>
                  </div>
                ) : (
                  paths.map(path => (
                    <Card key={path.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{path.title}</CardTitle>
                            <CardDescription className="mt-1">{path.description}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            {/* <Button variant="ghost" size="icon" onClick={() => handleEditPath(path)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePath(path.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button> */}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Passos da Trilha:</h4>
                          {path.steps.sort((a, b) => a.order - b.order).map((step, index) => {
                            const isLast = index === path.steps.length - 1;
                            
                            let content;
                            let title = "";
                            
                            if (step.contentType === 'course') {
                              const course = courses.find(c => c.id === step.contentId);
                              title = course ? course.title : "Curso não encontrado";
                              content = (
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-5 w-5 text-blue-500" />
                                  <span>Curso: {title}</span>
                                </div>
                              );
                            } else {
                              const cert = certifications.find(c => c.id === step.contentId);
                              title = cert ? cert.title : "Certificação não encontrada";
                              content = (
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-5 w-5 text-green-500" />
                                  <span>Certificação: {title}</span>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={`${step.contentType}-${step.contentId}`} className="relative pl-8">
                                <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-xs font-bold">{step.order}</span>
                                  </div>
                                  {!isLast && (
                                    <div className="w-px h-full bg-border mt-1"></div>
                                  )}
                                </div>
                                <div className="min-h-[2rem] flex items-center">
                                  {content}
                                </div>
                              </div>
                            );
                          })}
                          
                          {path.steps.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              Esta trilha não possui passos definidos.
                            </p>
                          )}
                          
                          {path.steps.length > 0 && (
                            <div className="relative pl-8 mt-2">
                              <div className="absolute left-0 top-0 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                </div>
                              </div>
                              <div className="min-h-[2rem] flex items-center text-green-600 font-medium">
                                Trilha Concluída
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberGraduation;
