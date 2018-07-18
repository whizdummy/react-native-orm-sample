import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { Schema } from 'react-native-orm';

import { Employee } from './models';

class Index extends Component {
    constructor(props) {
        super(props);

        this._databaseInstance = null;
    }

    state = {
        logs: []
    };

    async _fnCreateEmployees(employees = []) {
        return new Promise(async (resolve, reject) => {
            try {
                const employeeModel = new Employee({ dbInstance: this._databaseInstance });

                // Create/update record
                for (let employee of employees) {
                    await employeeModel.find(employee.uuid);

                    for (let employeeKey of Object.keys(employee)) {
                        employeeModel.getField(employeeKey)
                            .setFieldValue(employee[employeeKey]);
                    }

                    await employeeModel.save();
                }

                // You can also use this
                // but it will throw an error if you execute it the second time
                // (Unique constraint error)
                // await employeeModel.create(employees);

                return resolve('Employees successfully created/updated.');
            } catch (err) {
                return reject(err.message);
            }
        });
    }

    async _fnInitializeDatabase() {
        return new Promise(async (resolve, reject) => {
            const schema = new Schema({
                databaseName: 'RnORMSample.db'
            });
    
            try {
                // Open database
                const schemaRes = await schema.open();
    
                if (schemaRes.statusCode === 200) {
                    this._databaseInstance = schemaRes.data;
    
                    await Promise.all([
                        // Just insert new models here...
                        await schema.createTable(new Employee()),
                    ]);

                    return resolve(schemaRes.message);
                }
            } catch (err) {
                console.error('_fnInitializeDatabase error:', err.message);

                return reject(err.message);
            }
        });
    }

    async componentDidMount() {
        const logs = [].concat(this.state.logs);
        const employeeModel = new Employee({ dbInstance: this._databaseInstance });

        try {
            const initDbRes = await this._fnInitializeDatabase();

            // Create sample data
            const createEmpRes = await this._fnCreateEmployees([
                {
                    uuid:       '15a97c63-8bf8-4198-9c70-062b7b83b6fc',
                    first_name: 'Employee',
                    last_name:  'One'
                },
                {
                    uuid:       '4d5ca825-1940-46e8-8da7-3caf4617fdfc',
                    first_name: 'Employee',
                    last_name:  'Two'
                },
                {
                    uuid:       'dbb18c5d-b458-4cf5-ac3a-27d00eccd120',
                    first_name: 'Employee',
                    last_name:  'Three'
                }
            ]);

            // Get all employees
            const employees = (await employeeModel.all()).data;

            logs.push(initDbRes);
            logs.push(createEmpRes);

            employees.forEach((employee, index) => logs.push(`Employee data ${ index + 1 }: ${ JSON.stringify(employee) }`));

            this.setState({ logs });
        } catch (err) {
            console.error('componentDidMount error:', err.message);

            this.setState({ logs: logs.push(err.message) });
        }
    }

    render() {
        return (
            <View>
                {
                    this.state.logs.map((log, index) => <Text key={ index }>{ log }</Text>)
                }
            </View>
        );
    }
}

export default Index;