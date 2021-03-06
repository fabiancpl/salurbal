function typoDistribution( element ) {

  using_colors = true;

  typology_centroid = {
    "1" : {
      "x" : ( 1 / 3 ) * width,
      "y" : ( ( 1 / 4 ) * ( height - 100 ) ) + 100
    },
    "2" : {
      "x" : ( 2 / 3 ) * width,
      "y" : ( ( 1 / 4 ) * ( height - 100 ) ) + 100
    },
    "3" : {
      "x" : ( 1 / 3 ) * width,
      "y" : ( ( 2 / 4 ) * ( height - 100 ) ) + 100
    },
    "4" : {
      "x" : ( 2 / 3 ) * width,
      "y" : ( ( 2 / 4 ) * ( height - 100 ) ) + 100
    },
    "5" : {
      "x" : ( 1 / 3 ) * width,
      "y" : ( ( 3 / 4 ) * ( height - 100 ) ) + 100
    },
    "6" : {
      "x" : ( 2 / 3 ) * width,
      "y" : ( ( 3 / 4 ) * ( height - 100 ) ) + 100
    }
  };

  hide_boxplot();

  if( typologiesList != null ) typologiesList
    .transition()
      .duration( transition_duration )
      .style( "fill-opacity", 0 );

  // Stoping simulation
  if( typologySimul != null ) typologySimul.stop();
  
  typologySimul = d3.forceSimulation( csData.all() )
    .force( "collide", d3.forceCollide().radius( point_radius + 1 ) )
    .force( "x", d3.forceX( d => typology_centroid[ d[ 'TRANS_PROF' ] ][ "x" ] ).strength( .3 ) )
    .force( "y", d3.forceY( d => typology_centroid[ d[ 'TRANS_PROF' ] ][ "y" ] ).strength( .3 ) )
    .on( "tick", _ => {
        
        unitsPoints
          .attr( "cx", d => d.x )
          .attr( "cy", d => d.y );

    } );

  unitsPoints
    .transition()
      .duration( transition_duration )
      .attr( "fill",  d => cScale( d[ 'TRANS_PROF' ] )  );

  if( typologiesNumUnits == null ) {

    typologiesNumUnits = svg.selectAll( "text.typologiesNumUnits" )
      .data( csData.sumByTransProfiles.all() )
      .enter().append( "text" )
        .attr( "class", "typologiesNumUnits" )
        .attr( "x", d => typology_centroid[ d.key ][ "x" ] )
        .attr( "y", d => typology_centroid[ d.key ][ "y" ] - 60 )
        .attr( "fill", d => cScale( d.key ) )
        .attr( "text-anchor", "middle" )
        .text( d => "Profile " + d.key + " (" + d.value + ")" )
        .style( "font-size", "0.4em" )
        .style( "fill-opacity", 0 )
        .on( "mouseover", function( d ) {

            d3.select( this ).style( "cursor", "pointer" );

            typologiesNumUnits
              .attr( "fill", "gray" )
              .style( "fill-opacity", .4 )
              .filter( k => k.key === d.key )
                .attr( "fill", k => cScale( k.key ) )
                .style( "font-weight", "bold" )
                .style( "fill-opacity", 1 );

            if( typologiesList != null ) typologiesList
              .attr( "fill", "gray" )
              .style( "fill-opacity", .4 )
              .filter( k => k.key === d.key )
                .attr( "fill", k => cScale( k.key ) )
                .style( "fill-opacity", 1 );

            unitsPoints
              .attr( "fill", "gray" )
              .style( "fill-opacity", .4 )
              .filter( k => k[ 'TRANS_PROF' ] === d.key )
                .attr( "fill", d => cScale( using_colors ? d[ 'TRANS_PROF' ] : "0" ) )
                .style( "fill-opacity", 1 );

            countries = d3.map( csData.all()
              .filter( l => l[ 'TRANS_PROF' ] == d.key ), j => j[ "Country" ] ).keys();
            
            countriesList
              .attr( "fill", "gray" )
              .style( "fill-opacity", .4 )
              .filter( k => countries.indexOf( k.key ) >= 0 )
                .attr( "fill", k => cScale( "0" ) )
                .style( "fill-opacity", 1 );

            countriesNumUnits
              .attr( "fill", "gray" )
              .style( "fill-opacity", .4 )
              .filter( k => countries.indexOf( k.key ) >= 0 )
                .attr( "fill", k => cScale( "0" ) )
                .style( "fill-opacity", 1 );              

          } )
          .on( "mouseout", unhighlight );

      typologiesNumUnits
        .transition()
          .duration( transition_duration )
          .style( "fill-opacity", 1 );

    } else {

      typologiesNumUnits
        .moveToFront();

      typologiesNumUnits
        .transition()
          .duration( transition_duration )
          .attr( "text-anchor", "middle" )
          .attr( "x", d => typology_centroid[ d.key ][ "x" ] )
          .attr( "y", d => typology_centroid[ d.key ][ "y" ] - 60 );

    }

}