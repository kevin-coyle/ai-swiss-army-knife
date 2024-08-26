<template>
    <div>
        <nef-table>
            <nef-table-header>
                <nef-table-row>
                    <nef-table-cell>Name</nef-table-cell>
                    <nef-table-cell>GDP (in billions)</nef-table-cell>
                    <nef-table-cell>Population</nef-table-cell>
                </nef-table-row>
            </nef-table-header>
            <nef-table-row v-for="state in states" :key="state.name">
                <nef-table-cell>{{ state.name }}</nef-table-cell>
                <nef-table-cell>{{ state.gdp }}</nef-table-cell>
                <nef-table-cell>{{ state.population }}</nef-table-cell>
            </nef-table-row>
        </nef-table>
        <nef-button>This is a button</nef-button>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const states = ref([
            { name: "California", gdp: 3128.0, population: 39538223 },
            { name: "Texas", gdp: 2075.0, population: 29145505 },
            { name: "New York", gdp: 1846.0, population: 20201249 },
            { name: "Florida", gdp: 1117.0, population: 21538187 },
            { name: "Illinois", gdp: 877.0, population: 12812508 },
            { name: "Pennsylvania", gdp: 804.0, population: 13002700 },
            { name: "Ohio", gdp: 693.0, population: 11799448 },
            { name: "Georgia", gdp: 611.0, population: 10711908 },
            { name: "North Carolina", gdp: 613.0, population: 10439388 },
            { name: "Michigan", gdp: 498.0, population: 10077331 },
            { name: "New Jersey", gdp: 661.0, population: 9288994 },
            { name: "Virginia", gdp: 500.0, population: 8631393 },
            { name: "Washington", gdp: 601.0, population: 7693612 },
            { name: "Arizona", gdp: 430.0, population: 7158027 },
            { name: "Massachusetts", gdp: 635.0, population: 7029917 },
            { name: "Tennessee", gdp: 410.0, population: 6910840 },
            { name: "Indiana", gdp: 377.0, population: 6785528 },
            { name: "Missouri", gdp: 347.0, population: 6154913 },
            { name: "Maryland", gdp: 421.0, population: 6177224 },
            { name: "Wisconsin", gdp: 360.0, population: 5893718 },
            { name: "Colorado", gdp: 392.0, population: 5773714 },
        ]);

        return { states };
    },
};
</script>
