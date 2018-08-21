import { Model } from "react-native-orm";

export class Employee extends Model {
    constructor(props = {}) {
        super({
            dbInstance:     props.dbInstance || null,
            tableName:      'Employee',
            tableFields: {
                uuid:       'string|primary',
                first_name: 'string',
                last_name:  'string',
                position:   'string'
            },
            assignableFields: [
                'uuid',
                'first_name',
                'middle_name',
                'last_name'
            ]
        });
    }

    /**
     * Add additional columns
     */
    addColumns = () => {
        return {
            version: 2,
            fields: {
                middle_name:    'string',
                age:            'int'
            }
            // version: 3,
            // fields: {
            //     is_active:    'boolean'
            // }
        };
    }
}