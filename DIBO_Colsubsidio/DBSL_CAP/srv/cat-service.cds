using {logical.data as ns} from '../db/data-model';

service myservice {
    entity  T_COR_PROYECTO as projection on ns.T_COR_PROYECTO;
}