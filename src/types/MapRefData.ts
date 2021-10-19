
export interface MapRefList {
    id:         string;
    seed:       number;
    difficulty: number;
    maps:       MapRefData[];
}

export interface MapRefData {
    id:      number;
    name:    string;
    act: number;
    mapText?: string;
    mapIcon?: string;
}