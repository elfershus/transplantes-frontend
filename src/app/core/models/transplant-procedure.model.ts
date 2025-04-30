import { Doctor } from './doctor.model';
import { Institution } from './institution.model';
import { Receiver } from './receiver.model';
import { Organ } from './organ.model';
import { Compatibility } from './compatibility.model';

export interface TransplantProcedure {
  id?: number;
  scheduledDate: string;
  actualDate?: string;
  durationMinutes?: number;
  outcome?: 'successful' | 'failed' | 'complications' | null;
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

  leadDoctorId?: number;
  leadDoctor?: Doctor;

  institutionId?: number;
  institution?: Institution;

  receiverId?: number;
  receiver?: Receiver;

  organId?: number;
  organ?: Organ;

  compatibilityId?: number;
  compatibility?: Compatibility;

  createdAt?: string;
  updatedAt?: string;
}
