/**
 * @fileoverview Sketch class for use with the Biolab activity suite.
 * @copyright Carnegie Mellon University 2019
 * @author zmineroff@cmu.edu (Zach Mineroff)
 */

import '@cmu-eberly-center/p5/lib/addons/p5.dom.js';
import 'p5.play';
import Beaker from 'p5.beaker/beaker.js';
import ConjugateBase from 'p5.beaker/conjugate_base.js';
import Proton from 'p5.beaker/proton.js';

const numInitialProtons = 10;
export const numConjugateBases = 10;
export let numProtons = numInitialProtons;
export let numAcids = 0;

var particleTableUpdate = function(pNumAcids,pNumConjugateBases) {
  pNumAcids.html(numAcids);
  pNumConjugateBases.html(numConjugateBases-numAcids);
}

var particleTableColumn = function(p,table,column_data) {
  const images = column_data["images"];
  const image_div = p.createDiv().class("particle");
  if (images) {
      images.forEach((image) => {
          image_div.child(image);
      });
  }

  const label = column_data["label"];
  const label_p = p.createP(label).class("label");

  const data = column_data["data"];

  const columnElts = [image_div,label_p,data];
  const rows = table.child();

  for (let iRow = 0; iRow < rows.length; iRow++) {
    var td = p.createElement('td');
    td.parent(rows[iRow]);
    td.child(columnElts[iRow]);
  }
}

var particleTableSetup = function(p,pNumAcids,pNumConjugateBases) {
  var table = p.createElement('table').id("particle-table");
  var nRows = 3;
  for (let iRow = 0; iRow < nRows; iRow++) {
    var tr = p.createElement('tr');
    table.child(tr);
  }

  // Acid column
  const acid_column_data = {};
  acid_column_data["images"] = [
      p.createImg(ConjugateBase.prototype.
                  image_path,'Conjugate Base').class("base"),
      p.createImg(Proton.prototype.
                  image_path,'Proton').class("proton")
  ];
  acid_column_data["label"] = "acid";
  acid_column_data["data"] = pNumAcids;
  particleTableColumn(p,table,acid_column_data);

  // Comparison column
  const comparison_column_data = {};
  comparison_column_data["label"] = "&lt;=&gt;"
  particleTableColumn(p,table,comparison_column_data);

  // Conjugate base column
  const conjugate_base_column_data = {};
  conjugate_base_column_data["images"] = [
      p.createImg(ConjugateBase.
                  prototype.image_path,
                  'Conjugate Base')
  ];
  conjugate_base_column_data["label"] = "conjugate base";
  conjugate_base_column_data["data"] = pNumConjugateBases;
  particleTableColumn(p,table,conjugate_base_column_data);
};

var updateNumProtons = function(beaker,newNumProtons) {
  var deltaProtons = newNumProtons - numProtons;
  if (deltaProtons > 0) {
      beaker.addParticles(Proton,deltaProtons);
  }
  else if (deltaProtons < 0) {
      beaker.removeParticles(Proton,Math.abs(deltaProtons));
  }
  numProtons += deltaProtons;
};

var inputNumProtonsSetup = function(beaker,sliderNumProtons) {
  /** @this p5.Element */
  var inputNumProtonsEvent = function() {
      var newNumProtons = parseInt(this.value(),10);
      if (newNumProtons===newNumProtons) { // Only if not NaN
          updateNumProtons(beaker,newNumProtons);
      }
  };
  sliderNumProtons.changed(inputNumProtonsEvent);
}

// Register callbacks to update UI
var registerUICallbacks = function(pNumAcids,pNumConjugateBases) {
    ConjugateBase.prototype.register_callback("release_proton","pre",
                          () => {
                              numAcids-=1;
                              particleTableUpdate(pNumAcids,
                                                  pNumConjugateBases);
                          });
    ConjugateBase.prototype.register_callback("reacts_with_proton","post",
                          () => {
                              numAcids+=1;
                              particleTableUpdate(pNumAcids,
                                                  pNumConjugateBases);
                          });
}

var UISetup = function(p,beaker) {
  // Particle table
  var pNumConjugateBases = p.createP(numConjugateBases).
        id("num-conjugate-bases");
  var pNumAcids = p.createP(numAcids).id("num-acids");
  particleTableSetup(p,pNumAcids,pNumConjugateBases);

  // Number of protons slider
  const minNumProtons = 0;
  const maxNumProtons = 64;
  const numProtonsStep = 1;
  var slidernumProtons = p.createSlider(minNumProtons,
                                        maxNumProtons,
                                        numInitialProtons,
                                        numProtonsStep).
                                        id("num-protons");
  inputNumProtonsSetup(beaker,slidernumProtons);

  registerUICallbacks(pNumAcids,pNumConjugateBases);
}

/**
 * A Biolab sketch
 * @class Sketch
 */
export default function Sketch(p) {
    let beaker = null;

    p.preload = function() {
        Beaker.prototype.preload(p);
        ConjugateBase.prototype.preload(p);
        Proton.prototype.preload(p);
    }

    p.setup = function() {
        p.createCanvas(343,322);
        p.background(255,255,255);

        beaker = new Beaker(p,286,278,0,0,38,34);

        UISetup(p,beaker);

        beaker.addParticles(Proton,numConjugateBases);
        beaker.addParticles(ConjugateBase,numInitialProtons);
    };

    p.draw = function() {
        beaker.step();
        beaker.draw();
    };
}
