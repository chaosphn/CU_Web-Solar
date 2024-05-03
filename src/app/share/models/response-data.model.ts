import { ItemParameters } from '../../core/stores/last-values/dashboard/dashboard-last-values.model';

export interface ResponseData {
    RequestId: string;
    DataSets?: ItemParameters[];
    Success?: boolean;
    Message?: string;
}
