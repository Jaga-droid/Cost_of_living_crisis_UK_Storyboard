function toggleDiv(divid) {

    varon = divid + 'id';
    varoff = divid + 'Zoomid';

    if (document.getElementById(varon).style.display == 'block') {
        document.getElementById(varon).style.display = 'none';
        document.getElementById(varoff).style.display = 'block';
    } else {
        document.getElementById(varoff).style.display = 'none';
        document.getElementById(varon).style.display = 'block'
    }
}

function togglebar(divid) {
    var node = document.getElementById('barswitchInsights');
    var node_1 = document.getElementById('barchange');
    switch (divid) {
        case 'bbar1':
            node_1.textContent=' POPULATION_DENSITY';
            node.textContent = 'It can be noted that despite a high population density for Singapore, the number of covid cases and deaths remain minimal.';
            break;
        case 'bbar2':
            node_1.textContent=' HOSPITAL_BEDS_PER_THOUSAND';
            node.textContent = 'Singapore and South Korea possess superior hospital facilites and proved to be capable of accomodating volumes of patients which was instrumental in keeping the covid cases and deaths low.';
            break;
        case 'bbar3':
            node_1.textContent=' POSITIVE_RATE';
            node.textContent = 'For South Korea and Singapore, a good share of the covid tests are positive which enabled their doctors to take swift action to mitigate the effects of the virus on their patients. India however failed to achieve this.';
            break;
        case 'bbar4':
            node_1.textContent=' STRINGENCY_INDEX';
            node.textContent = 'Despite having comparable Stringency index to that of Korea and Singapore, Indian cases and deaths are still high which indicates that people could not have cooperated with the government regarding safety measures';
            break;
        case 'bbar5':
            node_1.textContent=' TESTS_PER_CASES';
            node.textContent = 'Despite conducting a huge number of tests, India seems to have more deaths on average due to the lack of hospital facilities as mentioned earlier. Singapore, however also seems to have conducted a very small number of tests yet succeeded which could indicate the high quality of their test kits. ';
            break;


    }

}

function togglebar2(divid) {
    var node = document.getElementById('barswitchInsights2');
    var node_1 = document.getElementById('barchange2');
    switch (divid) {
        case 'bbar11':
            node_1.textContent='COASTAL REGIONS (IN THOUSANDS)';
            node.textContent = ' When taking geographic position into account, we can see that countries in the coastal regions are affected the most, for instance, America.';
            break;
        case 'bbar22':
            node_1.textContent=' ISLAND REGIONS';
            node.textContent = 'Island regions turn out to be the safest from COVID.';
            break;
       

    }

}