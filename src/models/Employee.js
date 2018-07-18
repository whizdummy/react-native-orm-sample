import { Model } from "react-native-orm";

export class Employee extends Model {
    constructor(props = {}) {
        super();

        this.modelName = 'Employee';
        
        // TODO:
        // Segregate table structure
        this.fields = {
            uuid:       'string|primary',
            first_name: 'string',
            last_name:  'string',
            position:   'string'
        };

        // Required: For MedAlertORM
        this.tableName(this.modelName)
            .tableFields(this.fields);
        // Required: For MedAlertORM
        this.setDatabaseInstance(props.dbInstance || null);
        
        // Assignable fields
        this.setAssignableFields(Object.keys(this.fields));
    }

    getModelName = () => {
        return this.modelName;
    }

    getModelFields = () => {
        return this.fields;
    }
}