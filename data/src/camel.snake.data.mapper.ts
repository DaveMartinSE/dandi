import { Injectable }   from '@dandi/core';
import { camel, param } from 'change-case';


import { DataMapper } from './data.mapper';
import { mapKeys }    from './map.keys';

@Injectable(DataMapper)
export class CamelSnakeDataMapper implements DataMapper {

    private initPath(path: string[], parent: any, value: any, emptySegments: Map<any, Set<string>>): void {
        const segment = path.pop();
        if (!path.length) {
            parent[segment] = value;
            return;
        }

        if (!parent[segment] && !value) {
            let entry = emptySegments.get(parent);
            if (!entry) {
                entry = new Set<string>();
                emptySegments.set(parent, entry);
            }
            entry.add(segment);
        }
        if (parent[segment] && value) {
            let entry = emptySegments.get(parent);
            if (entry) {
                entry.delete(segment);
            }
        }


        const obj = parent[segment] || {};
        parent[segment] = obj;
        this.initPath(path, obj, value, emptySegments);
    }

    private unnestKeys(obj: any): any {
        const emptySegments = new Map<any, Set<string>>();
        const result = Object.keys(obj)
            .reduce((result, key) => {
                const path = key.split('.').reverse();
                this.initPath(path, result, obj[key], emptySegments);
                return result;
            }, {});

        // remove any completely empty objects
        Array.from(emptySegments.entries()).forEach(([parent, keys]) => {
            keys.forEach(key => delete parent[key]);
        });

        return result;
    }

    public mapFromDb<T>(obj: any): T {
        // FIXME! mapKeys mangles array properties!
        return mapKeys(camel, this.unnestKeys(obj));
    }

    public mapToDb<T>(obj: T): any {
        return mapKeys(param, Object.assign({}, obj));
    }

}
