export type ContentType = 'course' | 'class' | 'certification' | 'path';

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course  {
   id: string;
  title: string;
  description: string;
  type: 'course';
  classes: string[];
  duration: number;
createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  title: string;
  video_url?: string;
  duration: number;
  materials: string[];
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  required_courses: string[];
  max_attempts: number;
}

export interface LearningPath extends EducationalContent {
  type: 'path';
  steps: {
    contentId: string;
    contentType: 'course' | 'certification';
    order: number;
  }[];
}