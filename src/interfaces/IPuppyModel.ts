export interface PuppyModel {
  id: number;
  name?: string;
  sex?: string;
  color?: string;
  dateOfBirth?: string;
  status?: string;
  description?: string;
  imageUrl?: string;
  litterId?: number;
  litterName?: string;
}

export interface LitterModel {
  id: number;
  name?: string;
  dateOfBirth?: string;
  fatherId?: number;
  fatherName?: string;
  motherId?: number;
  motherName?: string;
  description?: string;
  status?: string;
  coverImageUrl?: string;
  puppyCount: number;
  availablePuppyCount: number;
}
