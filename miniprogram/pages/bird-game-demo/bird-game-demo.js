// Page for demonstrating the Bird Identification Game component
Page({
  data: {
    birdData: [
      { id: 1, name: 'Great Egret', image: '/images/alba.png', species: 'Ardea alba' },
      { id: 2, name: 'Red-winged Blackbird', image: '/images/blackbird-redwinged.png', species: 'Agelaius phoeniceus' },
      { id: 3, name: 'Canada Goose', image: '/images/goose-canada.png', species: 'Branta canadensis' },
      { id: 4, name: 'Blue Jay', image: '/images/jay-blue.png', species: 'Cyanocitta cristata' },
      { id: 5, name: 'Northern Cardinal', image: '/images/cardinal-northern.png', species: 'Cardinalis cardinalis' },
      { id: 6, name: 'American Robin', image: '/images/robin-american.png', species: 'Turdus migratorius' },
      { id: 7, name: 'House Sparrow', image: '/images/sparrow-house.png', species: 'Passer domesticus' },
      { id: 8, name: 'Chipping Sparrow', image: '/images/sparrow-chipping.png', species: 'Spizella passerina' },
      { id: 9, name: 'Tree Sparrow', image: '/images/sparrow-tree.png', species: 'Spizella arborea' },
      { id: 10, name: 'White-throated Sparrow', image: '/images/sparrow-whitethroat.png', species: 'Zonotrichia albicollis' }
    ]
  },

  onLoad(options) {
    // Page initialization
  }
});