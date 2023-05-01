/*const linea=document.getElementsByTagName("line")
console.log(linea)*/

function calcula() {
    if (document.getElementById("esRectaVertical").checked) {
        document.getElementById("DeltaHRv=").value=0;
    }else{
        const RV=document.getElementById("Rv=").value;
        document.getElementById("DeltaHRv=").value=50/RV;
    };
    const fsvmax=document.getElementById("fsvmax=");
    const fsvmin=document.getElementById("fsvmin=");
    const fwsfwa=document.getElementById("fwsfwa=");
    const hf=document.getElementById("hf=");
    const heffvmax=document.getElementById("heffvmax=");
    const heffvmin=document.getElementById("heffvmin=");
    const belecestati=document.getElementById("belecestati=");
    const besecdinama=document.getElementById("besecdinama=");
    const heffelecvmax=document.getElementById("heffelecvmax=");
    const heffelecvmin=document.getElementById("heffelecvmin=");
    const heff=document.getElementById("heff=");
    const TD=Number(document.getElementById("TD=").value);
    const alfasusp=Number(document.getElementById("alfaSusp=").value);
    const alfacarga=Number(document.getElementById("alfaCarga=").value);
    const alfaOscI040=Number(document.getElementById("alfaOscI040=").value);
    const alfaOscI030=Number(document.getElementById("alfaOscI030=").value);
    const alfaOscA040=Number(document.getElementById("alfaOscA040=").value);
    const alfaOscA030=Number(document.getElementById("alfaOscA030=").value);
    const M3b=Number(document.getElementById("M3b=").value);
    const M3h=Number(document.getElementById("M3h=").value);
    const DeltaHRv=Number(document.getElementById("DeltaHRv=").value);
    const TN=Number(document.getElementById("TN=").value);
    const K=Number(document.getElementById("K=").value);
    const Kale=Number(document.getElementById("Kale=").value);
    heffvmax.value=Number(hf.value)+Number(fsvmax.value)+Number(fwsfwa.value);
    heffvmin.value=Number(hf.value)+Number(fsvmin.value)+Number(fwsfwa.value);
    heffelecvmax.value=Number(besecdinama.value)+Number(heffvmax.value);
    heffelecvmin.value=Number(belecestati.value)+Number(heffvmin.value);
    heff.value=Math.max(heffvmax.value,heffvmin.value);
    const correcc=document.getElementById("correccion").checked

    /*Determinación del gálibo*/
    const nombreGalibo=document.getElementById("GaliboPartesAltas").value;
    const nombreGaliboPB=document.getElementById("GaliboPartesBajas").value;
    let galiboDibujo=undefined
    let galiboDibujoPB=undefined
    for (const galiboPB of galibosPB) {
        if (galiboPB.nombre==nombreGaliboPB){
            galiboDibujoPB=galiboPB
            break
        }
    }
    for (const galibo of galibos){
        if (galibo.nombre==nombreGalibo){
            galiboDibujo=galibo
            const chquiebroaux=galibo.hquiebroaux;
            const chtopeaux=galibo.htopeaux;
            const cdifaux=galibo.difaux;
            const chotra=galibo.hotra;
            /*Lo que no depende del gálibo degbería sacarlo fuera, para no tener que iterar*/
            const R=Number(document.getElementById("R=").value);
            const DeltaL=Number(document.getElementById("DeltaLN=").value);
            const L=Number(document.getElementById("L=").value);
            const D=Number(document.getElementById("D=").value);
            const D0=Number(document.getElementById("D0=").value);
            const I=Number(document.getElementById("I=").value);
            const I0=Number(document.getElementById("I0=").value);
            const hc0=Number(document.getElementById("hc0=").value);
            let maxy= 0
            for (punto of galibo.contorno){if (punto.y>maxy) {maxy=punto.y}}
                
            for (punto of galibo.contorno){
                if (punto.y==maxy) {punto.esPT=true} else {punto.esPT=false}
                if (galibo.nombre=="GHE16" || galibo.nombre=="GEC16" || galibo.nombre=="GC"){
                    punto.k=0;
                    punto.s0=0.4;
                    if (R>=250){
                        punto.Sa=3.75/R+DeltaL/2;
                        punto.Si=3.75/R+DeltaL/2;
                    }
                    else{
                        punto.Sa=60/R-0.225+DeltaL/2;
                        punto.Si=50/R-0.185+DeltaL/2;
                    };
                }
                if (galibo.nombre=="GEA16" || galibo.nombre=="GEB16" || galibo.nombre=="GA" || galibo.nombre=="GB") {
                    if(punto.y<=chquiebroaux){
                        punto.k=0
                    }else{
                        if(punto.y>=chtopeaux) {punto.k=1}
                        else {punto.k=(punto.y-chquiebroaux)/cdifaux}
                    };
                    if(punto.y<=chquiebroaux){
                        punto.s0=0.4
                    }else{
                        if(punto.y>=chtopeaux) {punto.s0=0.3}
                        else {punto.s0=(chotra-punto.y)/(10*cdifaux)}
                    };
                    if(R>=250 && punto.y<=chquiebroaux){
                        punto.Sa=3.75/R+DeltaL/2;
                        punto.Si=3.75/R+DeltaL/2;
                    }
                    else if(R>=250 && punto.y>chquiebroaux) {
                        punto.Sa=3.75/R+16.25*punto.k/R+DeltaL/2;
                        punto.Si=3.75/R+16.25*punto.k/R+DeltaL/2;
                    }
                    else if(R<250 && punto.y<=chquiebroaux) {
                        punto.Sa=60/R-0.225+DeltaL/2;
                        punto.Si=50/R-0.185+DeltaL/2;
                    }
                    else if(R<250 && punto.y>chquiebroaux) {
                        punto.Sa=60/R-0.225+punto.k*(0.105-10/R)+DeltaL/2;
                        punto.Si=50/R-0.185+punto.k*0.065+DeltaL/2;
                    }
                }
                if (galibo.nombre=="GEE10" || galibo.nombre=="GED10") {
                    punto.k=999
                    punto.s0=0.4
                    if (R>=100){
                        punto.Sa=1/R+DeltaL/2;
                        punto.Si=1/R+DeltaL/2;
                    }
                    else{
                        punto.Sa=24/R-0.23+DeltaL/2; //probablemente el 0.23 de la norma es una aproximación del 0.225 de arriba
                        punto.Sa=20/R-0.19+DeltaL/2; //probablemente el 0.19 de la norma es una aproximación del 0.185 de arriba
                    }; 
                };
                punto.qsDai=punto.s0/L*Math.max(0,D-D0)*Math.max(0,punto.y-hc0);
                punto.qsIai=punto.s0/L*Math.max(0,I-I0)*Math.max(0,punto.y-hc0);
                punto.Tviaai=Number(document.getElementById("Tvia=").value);
                punto.Deltabgai=punto.y*TD/L;   
                punto.Deltabcai=punto.s0*TD*Math.max(0,punto.y-hc0)/L;
                punto.Deltabsuspai=Math.tan(alfasusp*Math.PI/180)*Math.max(0,punto.y-hc0);
                punto.Deltabcargaai=Math.tan(alfacarga*Math.PI/180)*Math.max(0,punto.y-hc0);
                punto.Deltabeta0ai=punto.Deltabsuspai+punto.Deltabcargaai;
                /*Revisar las dos siguientes líneas*/
                punto.Deltabosci=Math.tan((-10*(punto.s0-0.4)*alfaOscI030+10*(punto.s0-0.3)*alfaOscI040)*Math.PI/180)*Math.max(0,punto.y-hc0);
                punto.Deltabosca=Math.tan((-10*(punto.s0-0.4)*alfaOscA030+10*(punto.s0-0.3)*alfaOscA040)*Math.PI/180)*Math.max(0,punto.y-hc0);
                //fin revisión
                punto.M3b=M3b;

                punto.DeltaHRv=DeltaHRv;
                punto.DeltaHPTDai=Math.abs(punto.x)*punto.s0*(D-D0)/L;
                punto.DeltaHPTIai=Math.abs(punto.x)*punto.s0*(I-I0)/L;
                punto.TN=TN;
                punto.Deltahga=(Math.abs(punto.x)/L+0.5)*TD;
                punto.Deltahgi=(Math.abs(punto.x)/L-0.5)*TD;
                punto.Deltahc=punto.s0*Math.abs(punto.x)*TD/L;
                punto.Deltahsuspai=Math.abs(punto.x)*Math.tan(alfasusp*Math.PI/180)
                punto.Deltahcargaai=Math.abs(punto.x)*Math.tan(alfacarga*Math.PI/180)
                punto.Deltaheta0ai=Math.abs(punto.x)*Math.tan((alfacarga+alfasusp)*Math.PI/180)
                //Revisar las dos siguientes líneas
                punto.Deltahosci=Math.tan((-10*(punto.s0-0.4)*alfaOscA030+10*(punto.s0-0.3)*alfaOscA040)*Math.PI/180)*Math.abs(punto.x);
                punto.Deltahosca=Math.tan((-10*(punto.s0-0.4)*alfaOscI030+10*(punto.s0-0.3)*alfaOscI040)*Math.PI/180)*Math.abs(punto.x);
                punto.M3h=M3h;

                punto.K= punto.y<0.5 ? Kale : K
                const angj2i=correcc ? punto.Deltabeta0ai**2+punto.Deltabosci**2 : punto.Deltabsuspai**2+punto.Deltabcargaai**2+punto.Deltabosci**2;
                const angj2a=correcc ? punto.Deltabeta0ai**2+punto.Deltabosca**2 : punto.Deltabsuspai**2+punto.Deltabcargaai**2+punto.Deltabosca**2;
                punto.Sigmaji1=punto.K*((punto.Tviaai)**2+(punto.Deltabgai+punto.Deltabcai)**2+angj2i)**0.5;
                punto.Sigmaja1=punto.K*((punto.Tviaai)**2+(punto.Deltabgai+punto.Deltabcai)**2+angj2a)**0.5;
                punto.Sigmaji2=punto.K*((punto.Tviaai)**2+(punto.Deltabgai)**2)**0.5;
                punto.Sigmaja2=punto.K*((punto.Tviaai)**2+(punto.Deltabgai)**2)**0.5;
                const radicSigmaji1p=(punto.Tviaai)**2-(punto.Deltabgai+punto.Deltabcai)**2-angj2i;
                const radicSigmaja1p=(punto.Tviaai)**2-(punto.Deltabgai+punto.Deltabcai)**2-angj2a;
                const radicSigmaj2=(punto.Tviaai)**2-(punto.Deltabgai)**2;
                punto.Sigmaji1p=punto.K*Math.sign(radicSigmaji1p)*(Math.abs(radicSigmaji1p))**0.5;
                punto.Sigmaja1p=punto.K*Math.sign(radicSigmaja1p)*(Math.abs(radicSigmaja1p))**0.5;
                punto.Sigmaji2p=punto.K*Math.sign(radicSigmaj2)*(Math.abs(radicSigmaj2))**0.5;
                punto.Sigmaja2p=punto.K*Math.sign(radicSigmaj2)*(Math.abs(radicSigmaj2))**0.5;

                const angV2i=correcc ? punto.Deltaheta0ai**2+punto.Deltahosci**2 : punto.Deltahsuspai**2+punto.Deltahcargaai**2+punto.Deltahosci**2;
                const angV2a=correcc ? punto.Deltaheta0ai**2+punto.Deltahosca**2 : punto.Deltahsuspai**2+punto.Deltahcargaai**2+punto.Deltahosca**2;

                const radicSigmaVi1=(punto.TN)**2+(Math.max(0,-punto.Deltahgi-punto.Deltahc))**2-angV2i;
                const radicSigmaVa1=(punto.TN)**2-(punto.Deltahga+punto.Deltahc)**2-angV2a;
                punto.SigmaVi1=punto.K*Math.sign(radicSigmaVi1)*(Math.abs(radicSigmaVi1))**0.5;
                punto.SigmaVa1=punto.K*Math.sign(radicSigmaVa1)*(Math.abs(radicSigmaVa1))**0.5;
                punto.SigmaVi2=punto.TN;
                punto.SigmaVa2=punto.TN;
                punto.SigmaVi1p=punto.K*((punto.TN)**2+(Math.max(0,punto.Deltahgi+punto.Deltahc))**2+angV2i)**0.5;
                punto.SigmaVa1p=punto.K*((punto.TN)**2+(punto.Deltahga+punto.Deltahc)**2+angV2a)**0.5;
                punto.SigmaVi2p=punto.TN;
                punto.SigmaVa2p=punto.TN;

                punto.bobstVmaxib_lim=Number(punto.x+Math.sign(punto.x)*(punto.Si-punto.qsIai+ (punto.y>2 ? punto.Sigmaji1 : punto.Sigmaji2))).toFixed(3);
                punto.hobstVmaxib_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTIai+punto.SigmaVi1)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi2)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVmaxab_lim=Number(punto.x+Math.sign(punto.x)*(punto.Sa+punto.qsIai+ (punto.y>2 ? punto.Sigmaja1 : punto.Sigmaja2))).toFixed(3);
                punto.hobstVmaxab_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTIai+punto.SigmaVa1)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa2)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVmaxih_lim=Number(punto.x+Math.sign(punto.x)*(punto.Si-punto.qsIai+ (punto.y>2 ? punto.Sigmaji1p : punto.Sigmaji2p))).toFixed(3);
                punto.hobstVmaxih_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTIai+punto.SigmaVi1p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi2p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVmaxah_lim=Number(punto.x+Math.sign(punto.x)*(punto.Sa+punto.qsIai+ (punto.y>2 ? punto.Sigmaja1p : punto.Sigmaja2p))).toFixed(3);
                punto.hobstVmaxah_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTIai+punto.SigmaVa1p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa2p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminib_lim=Number(punto.x+Math.sign(punto.x)*(punto.Si+punto.qsDai+ (punto.y>2 ? punto.Sigmaji1 : punto.Sigmaji2))).toFixed(3);
                punto.hobstVminib_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTDai+punto.SigmaVi1)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi2)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminab_lim=Number(punto.x+Math.sign(punto.x)*(punto.Sa-punto.qsDai+ (punto.y>2 ? punto.Sigmaja1 : punto.Sigmaja2))).toFixed(3);
                punto.hobstVminab_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTDai+punto.SigmaVa1)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa2)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminih_lim=Number(punto.x+Math.sign(punto.x)*(punto.Si+punto.qsDai+ (punto.y>2 ? punto.Sigmaji1p : punto.Sigmaji2p))).toFixed(3);
                punto.hobstVminih_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTDai+punto.SigmaVi1p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi2p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminah_lim=Number(punto.x+Math.sign(punto.x)*(punto.Sa-punto.qsDai+ (punto.y>2 ? punto.Sigmaja1p : punto.Sigmaja2p))).toFixed(3);
                punto.hobstVminah_lim=Number(punto.y+punto.DeltaHRv*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTDai+punto.SigmaVa1p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa2p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobsti_lim=Math.sign(punto.x)*Math.max(Math.abs(punto.bobstVmaxib_lim),Math.abs(punto.bobstVmaxih_lim),Math.abs(punto.bobstVminib_lim),Math.abs(punto.bobstVminih_lim))
                punto.hobsti_lim= punto.y>2 ? Math.max(punto.hobstVmaxib_lim,punto.hobstVmaxih_lim,punto.hobstVminib_lim,punto.hobstVminih_lim) : Math.min(punto.hobstVmaxib_lim,punto.hobstVmaxih_lim,punto.hobstVminib_lim,punto.hobstVminih_lim) //El 2 es la altura de la anchura máxima
                punto.bobsta_lim=Math.sign(punto.x)*Math.max(Math.abs(punto.bobstVmaxab_lim),Math.abs(punto.bobstVmaxah_lim),Math.abs(punto.bobstVminab_lim),Math.abs(punto.bobstVminah_lim))
                punto.hobsta_lim= punto.y>2 ? Math.max(punto.hobstVmaxab_lim,punto.hobstVmaxah_lim,punto.hobstVminab_lim,punto.hobstVminah_lim) : Math.min(punto.hobstVmaxab_lim,punto.hobstVmaxah_lim,punto.hobstVminab_lim,punto.hobstVminah_lim) //El 2 es la altura de la anchura máxima

                punto.Sigmaji3=punto.Tviaai+punto.Deltabgai+punto.Deltabcai+punto.Deltabsuspai+punto.Deltabcargaai+punto.Deltabosci;
                punto.Sigmaja3=punto.Tviaai+punto.Deltabgai+punto.Deltabcai+punto.Deltabsuspai+punto.Deltabcargaai+punto.Deltabosca;
                punto.Sigmaji4=punto.Tviaai+punto.Deltabgai;
                punto.Sigmaja4=punto.Tviaai+punto.Deltabgai;
                punto.Sigmaji3p=punto.Tviaai-punto.Deltabgai-punto.Deltabcai-punto.Deltabsuspai-punto.Deltabcargaai-punto.Deltabosci;
                punto.Sigmaja3p=punto.Tviaai-punto.Deltabgai-punto.Deltabcai-punto.Deltabsuspai-punto.Deltabcargaai-punto.Deltabosca;
                punto.Sigmaji4p=punto.Tviaai-punto.Deltabgai;
                punto.Sigmaja4p=punto.Tviaai-punto.Deltabgai;
                punto.SigmaVi3=punto.TN+Math.max(0,-(punto.Deltahgi+punto.Deltahc))-punto.Deltahsuspai-punto.Deltahcargaai-punto.Deltahosci;
                punto.SigmaVa3=punto.TN-punto.Deltahga-punto.Deltahc-punto.Deltahsuspai-punto.Deltahcargaai-punto.Deltahosca;
                punto.SigmaVi4=punto.TN;
                punto.SigmaVa4=punto.TN;
                punto.SigmaVi3p=punto.TN+Math.max(0,punto.Deltahgi+punto.Deltahc)+punto.Deltahsuspai+punto.Deltahcargaai+punto.Deltahosci;
                punto.SigmaVa3p=punto.TN+punto.Deltahga+punto.Deltahc+punto.Deltahsuspai+punto.Deltahcargaai+punto.Deltahosca;
                punto.SigmaVi4p=punto.TN;
                punto.SigmaVa4p=punto.TN;

                punto.bobstVmaxib_nom=Number(punto.x+Math.sign(punto.x)*(punto.Si-punto.qsIai+ (punto.y>0.4 ? punto.Sigmaji3 : punto.Sigmaji4)+punto.M3b)).toFixed(3);
                punto.hobstVmaxib_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTIai+punto.SigmaVi3)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi4)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVmaxab_nom=Number(punto.x+Math.sign(punto.x)*(punto.Sa+punto.qsIai+ (punto.y>0.4 ? punto.Sigmaja3 : punto.Sigmaja4)+punto.M3b)).toFixed(3);
                punto.hobstVmaxab_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTIai+punto.SigmaVa3)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa4)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVmaxih_nom=Number(punto.x+Math.sign(punto.x)*(punto.Si-punto.qsIai+ (punto.y>0.4 ? punto.Sigmaji3p : punto.Sigmaji4p)+punto.M3b)).toFixed(3);
                punto.hobstVmaxih_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTIai+punto.SigmaVi3p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi4p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVmaxah_nom=Number(punto.x+Math.sign(punto.x)*(punto.Sa+punto.qsIai+ (punto.y>0.4 ? punto.Sigmaja3p : punto.Sigmaja4p)+punto.M3b)).toFixed(3);
                punto.hobstVmaxah_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTIai+punto.SigmaVa3p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa4p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminib_nom=Number(punto.x+Math.sign(punto.x)*(punto.Si+punto.qsDai+ (punto.y>0.4 ? punto.Sigmaji3 : punto.Sigmaji4)+punto.M3b)).toFixed(3);
                punto.hobstVminib_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTDai+punto.SigmaVi3)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi4)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminab_nom=Number(punto.x+Math.sign(punto.x)*(punto.Sa-punto.qsDai+ (punto.y>0.4 ? punto.Sigmaja3 : punto.Sigmaja4)+punto.M3b)).toFixed(3);
                punto.hobstVminab_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTDai+punto.SigmaVa3)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa4)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminih_nom=Number(punto.x+Math.sign(punto.x)*(punto.Si+punto.qsDai+ (punto.y>0.4 ? punto.Sigmaji3p : punto.Sigmaji4p)+punto.M3b)).toFixed(3);
                punto.hobstVminih_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(-punto.DeltaHPTDai+punto.SigmaVi3p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVi4p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobstVminah_nom=Number(punto.x+Math.sign(punto.x)*(punto.Sa-punto.qsDai+ (punto.y>0.4 ? punto.Sigmaja3p : punto.Sigmaja4p)+punto.M3b)).toFixed(3);
                punto.hobstVminah_nom=Number(punto.y+(punto.DeltaHRv+punto.M3h)*Math.sign(punto.y-2)+punto.esPT*(punto.DeltaHPTDai+punto.SigmaVa3p)+(!punto.esPT)*Math.sign(punto.y-2)*(punto.SigmaVa4p)).toFixed(3) // el -2 es la altura de la anchura máxima
                punto.bobsti_nom=Math.sign(punto.x)*Math.max(Math.abs(punto.bobstVmaxib_nom),Math.abs(punto.bobstVmaxih_nom),Math.abs(punto.bobstVminib_nom),Math.abs(punto.bobstVminih_nom))
                punto.hobsti_nom= punto.y>0.4 ? Math.max(punto.hobstVmaxib_nom,punto.hobstVmaxih_nom,punto.hobstVminib_nom,punto.hobstVminih_nom) : Math.min(punto.hobstVmaxib_nom,punto.hobstVmaxih_nom,punto.hobstVminib_nom,punto.hobstVminih_nom) //El 2 es la altura de la anchura máxima
                punto.bobsta_nom=Math.sign(punto.x)*Math.max(Math.abs(punto.bobstVmaxab_nom),Math.abs(punto.bobstVmaxah_nom),Math.abs(punto.bobstVminab_nom),Math.abs(punto.bobstVminah_nom))
                punto.hobsta_nom= punto.y>0.4 ? Math.max(punto.hobstVmaxab_nom,punto.hobstVmaxah_nom,punto.hobstVminab_nom,punto.hobstVminah_nom) : Math.min(punto.hobstVmaxab_nom,punto.hobstVmaxah_nom,punto.hobstVminab_nom,punto.hobstVminah_nom) //El 2 es la altura de la anchura máxima

            };
            muestraResultados(galibo);
            break;
        };
    };
    dibuja(galiboDibujo,galiboDibujoPB);
}

function muestraResultados(galibo){
    const divNombres=document.getElementById("nombrepunto");
    const divX=document.getElementById("X");
    const divY=document.getElementById("Y");
    const divbobsti_lim=document.getElementById("bobsti_lim=");
    const divhobsti_lim=document.getElementById("hobsti_lim=");
    const divbobsta_lim=document.getElementById("bobsta_lim=");
    const divhobsta_lim=document.getElementById("hobsta_lim=");
    const divbobsti_nom=document.getElementById("bobsti_nom=");
    const divhobsti_nom=document.getElementById("hobsti_nom=");
    const divbobsta_nom=document.getElementById("bobsta_nom=");
    const divhobsta_nom=document.getElementById("hobsta_nom=");
    const divaux=document.getElementById("aux=");
    divNombres.replaceChildren("")
    divX.replaceChildren("")
    divY.replaceChildren("")
    divbobsti_lim.replaceChildren("")
    divhobsti_lim.replaceChildren("")
    divbobsta_lim.replaceChildren("")
    divhobsta_lim.replaceChildren("")
    divbobsti_nom.replaceChildren("")
    divhobsti_nom.replaceChildren("")
    divbobsta_nom.replaceChildren("")
    divhobsta_nom.replaceChildren("")
    divaux.replaceChildren("")
    const contorno=galibo.contorno;
    for (punto of contorno){
        var element_nombrepunto=document.createElement("h6");
        var element_X=document.createElement("h6");
        var element_Y=document.createElement("h6");
        var element_bobsti_lim=document.createElement("h6");
        var element_hobsti_lim=document.createElement("h6");
        var element_bobsta_lim=document.createElement("h6");
        var element_hobsta_lim=document.createElement("h6");
        var element_bobsti_nom=document.createElement("h6");
        var element_hobsti_nom=document.createElement("h6");
        var element_bobsta_nom=document.createElement("h6");
        var element_hobsta_nom=document.createElement("h6");
        //var element_aux=document.createElement("h6");
        element_nombrepunto.textContent=punto.punto
        element_X.textContent=punto.x
        element_Y.textContent=punto.y
        element_bobsti_lim.textContent=punto.bobsti_lim
        element_hobsti_lim.textContent=punto.hobsti_lim
        element_bobsta_lim.textContent=punto.bobsta_lim
        element_hobsta_lim.textContent=punto.hobsta_lim
        element_bobsti_nom.textContent=punto.bobsti_nom
        element_hobsti_nom.textContent=punto.hobsti_nom
        element_bobsta_nom.textContent=punto.bobsta_nom
        element_hobsta_nom.textContent=punto.hobsta_nom
        //element_aux.textContent=0
        divNombres.appendChild(element_nombrepunto)
        divX.appendChild(element_X)
        divY.appendChild(element_Y)
        divbobsti_lim.appendChild(element_bobsti_lim)
        divhobsti_lim.appendChild(element_hobsti_lim)
        divbobsta_lim.appendChild(element_bobsta_lim)
        divhobsta_lim.appendChild(element_hobsta_lim)
        divbobsti_nom.appendChild(element_bobsti_nom)
        divhobsti_nom.appendChild(element_hobsti_nom)
        divbobsta_nom.appendChild(element_bobsta_nom)
        divhobsta_nom.appendChild(element_hobsta_nom)
        //divaux.appendChild(element_aux)
    }
 
};

function dibujaLinea(valorX1,valorY1,valorX2,valorY2,stroke,strokeWidth,strokeDasharray,esDibujado) {
    const linea=document.createElementNS("http://www.w3.org/2000/svg","line")
    linea.setAttribute("x1",100*valorX1+250)
    linea.setAttribute("y1",600-100*valorY1)
    linea.setAttribute("x2",100*valorX2+250)
    linea.setAttribute("y2",600-100*valorY2)
    linea.style.stroke=stroke
    linea.style.strokeWidth=strokeWidth
    linea.style.strokeDasharray=strokeDasharray
    const texto=dibujaTexto(valorX1,valorY1,esDibujado)
    return [linea,texto]
}

function dibujaTexto(valorX,valorY,esDibujado) {
    const texto=document.createElementNS("http://www.w3.org/2000/svg","text")
    if (esDibujado) {
        texto.setAttribute("x", 100*valorX+250); 
        texto.setAttribute("y", 600-100*valorY); 
        texto.style.fontFamily = "Tahoma"; 
        texto.style.fontSize = "10";
        texto.textContent = valorX+", "+valorY;
    }
    return texto
}

function redibuja() {
    const nombreGalibo=document.getElementById("GaliboPartesAltas").value
    const nombreGaliboPB=document.getElementById("GaliboPartesBajas").value
    let galiboDibujo=undefined
    let galiboDibujoPB=undefined
    for (const galibo of galibos){
        if (galibo.nombre==nombreGalibo){
            galiboDibujo=galibo
            break;
        }
    }
    for (const galiboPB of galibosPB){
        if (galiboPB.nombre==nombreGaliboPB){
            galiboDibujoPB=galiboPB
            break;
        }
    }
    dibuja(galiboDibujo,galiboDibujoPB);
}
function dibuja(galibo,galiboPB) {
    var svg = document.getElementById("svg")
    const dibujaTextoContorno=document.getElementById("dibujaTextoContorno").checked
    const dibujaContornoLimi=document.getElementById("dibujaContornoLimi").checked
    const dibujaContornoLima=document.getElementById("dibujaContornoLima").checked
    const dibujaContornoNomi=document.getElementById("dibujaContornoNomi").checked
    const dibujaContornoNoma=document.getElementById("dibujaContornoNoma").checked
    svg.replaceChildren("")
    for (let i = 1; i < 10; i++) {
        const lineavertical = document.createElementNS("http://www.w3.org/2000/svg","line");
        lineavertical.setAttribute("x1",50*i)
        lineavertical.setAttribute("x2",50*i)
        lineavertical.setAttribute("y1",0)
        lineavertical.setAttribute("y2",700)
        lineavertical.style.stroke="rgb(50,50,50)"
        lineavertical.style.strokeDasharray=2
        svg.appendChild(lineavertical);
    }
    for (let i = 1; i < 14; i++) {
        const lineahorizontal = document.createElementNS("http://www.w3.org/2000/svg","line");
        lineahorizontal.setAttribute("x1",0)
        lineahorizontal.setAttribute("x2",500)
        lineahorizontal.setAttribute("y1",50*i)
        lineahorizontal.setAttribute("y2",50*i)
        lineahorizontal.style.stroke="rgb(50,50,50)"
        lineahorizontal.style.strokeDasharray=2
        svg.appendChild(lineahorizontal);
    }
    for (let i = 0; i < galibo.contorno.length-1; i++) {
        const result=dibujaLinea(galibo.contorno[i].x,galibo.contorno[i].y,galibo.contorno[i+1].x,galibo.contorno[i+1].y,"rgb(0,0,255)",2,"",dibujaTextoContorno)
        svg.appendChild(result[0]);
        svg.appendChild(result[1]);
        const result_limi=dibujaLinea(galibo.contorno[i].bobsti_lim,galibo.contorno[i].hobsti_lim,galibo.contorno[i+1].bobsti_lim,galibo.contorno[i+1].hobsti_lim,"rgb(0,125,255)",1,10,dibujaContornoLimi)
        svg.appendChild(result_limi[0]);
        svg.appendChild(result_limi[1]);
        const result_lima=dibujaLinea(galibo.contorno[i].bobsta_lim,galibo.contorno[i].hobsta_lim,galibo.contorno[i+1].bobsta_lim,galibo.contorno[i+1].hobsta_lim,"rgb(0,255,255)",1,10,dibujaContornoLima)
        svg.appendChild(result_lima[0]);
        svg.appendChild(result_lima[1]);
        const result_nomi=dibujaLinea(galibo.contorno[i].bobsti_nom,galibo.contorno[i].hobsti_nom,galibo.contorno[i+1].bobsti_nom,galibo.contorno[i+1].hobsti_nom,"rgb(255,0,255)",1,10,dibujaContornoNomi)
        svg.appendChild(result_nomi[0]);
        svg.appendChild(result_nomi[1]);
        const result_noma=dibujaLinea(galibo.contorno[i].bobsta_nom,galibo.contorno[i].hobsta_nom,galibo.contorno[i+1].bobsta_nom,galibo.contorno[i+1].hobsta_nom,"rgb(255,0,125)",1,10,dibujaContornoNoma)
        svg.appendChild(result_noma[0]);
        svg.appendChild(result_noma[1]);
    }
    const ultimopunto=galibo.contorno[galibo.contorno.length-1]
    svg.appendChild(dibujaTexto(ultimopunto.x,ultimopunto.y,dibujaTextoContorno))
    svg.appendChild(dibujaTexto(ultimopunto.bobsti_lim,ultimopunto.hobsti_lim,dibujaContornoLimi))
    svg.appendChild(dibujaTexto(ultimopunto.bobsta_lim,ultimopunto.hobsta_lim,dibujaContornoLima))
    svg.appendChild(dibujaTexto(ultimopunto.bobsti_nom,ultimopunto.hobsti_nom,dibujaContornoNomi))
    svg.appendChild(dibujaTexto(ultimopunto.bobsta_nom,ultimopunto.hobsta_nom,dibujaContornoNoma))
    for (let i = 0; i < galiboPB.contorno.length-1; i++) {
        const result=dibujaLinea(galiboPB.contorno[i].x,galiboPB.contorno[i].y,galiboPB.contorno[i+1].x,galiboPB.contorno[i+1].y,"rgb(0,0,255)",2,"",dibujaTextoContorno)
        svg.appendChild(result[0]);
        svg.appendChild(result[1]);
    }
}

function seleccionGaliboPartesAltas() {
    const nombreGalibo=document.getElementById("GaliboPartesAltas").value;;
    for (const galibo of galibos){
        if (galibo.nombre==nombreGalibo){
            const cln=document.getElementById("LN=");
            const cd0=document.getElementById("D0=");
            const ci0=document.getElementById("I0=");
            const chco=document.getElementById("hc0=");
            const cl=document.getElementById("L=");
            cln.value=galibo.I;
            cd0.value=galibo.D0;
            ci0.value=galibo.I0;
            chco.value=galibo.hco;
            cl.value=galibo.L;
            break;
        };
    }
    calcula();
};

function seleccionGaliboPartesBajas() {
    redibuja();
}

function seleccionCatenaria() {
    const valor=document.getElementById("Catenaria").value;
    for (const catenaria of catenarias){
        if (catenaria.nombre==valor){
            const fsvmax=document.getElementById("fsvmax=");
            const fsvmin=document.getElementById("fsvmin=");
            const fwsfwa=document.getElementById("fwsfwa=");
            fsvmax.value=catenaria.fsvmax;
            fsvmin.value=catenaria.fsvmin;
            fwsfwa.value=0.07
        };
    }
    calcula();
}

function seleccionObra() {
    /*cuidado, que esto requiere que L esté introducido previamente. poner un aviso o algo*/
    const valor=document.getElementById("Obra").value;
    const L=document.getElementById("L=").value;
    const cw=document.getElementById("cw=");
    if (L==1){
        cw.value=0;
    } else{
        if (valor=="Líneas existentes, para pantógrafos con trocadores aislados") {
            cw.value=0.2
        } else{
            cw.value=0
        }
    }
    calcula();
}

function seleccionPantografo() {
    const valor=document.getElementById("Pantografo").value;
    for (const pantografo of pantografos){
        if (pantografo.nombre==valor){
            const bp=document.getElementById("bp=");
            const bw=document.getElementById("bw=");
            const epo=document.getElementById("epo=");
            const epu=document.getElementById("epu=");
            const Dprima0=document.getElementById("D'0=");
            const Iprima0=document.getElementById("I'0=");
            bp.value=pantografo.bp;
            bw.value=pantografo.bw
            epo.value=pantografo.epo
            epu.value=pantografo.epu
            Dprima0.value=pantografo["D'0"]
            Iprima0.value=pantografo["I'0"]
        };
    }
    calcula();
}

function seleccionLinea() {
    const valor=document.getElementById("Linea").value;
    for (const linea of lineas){
        if (linea.nombre==valor){
            const belecestati=document.getElementById("belecestati=");
            const besecdinama=document.getElementById("besecdinama=");
            belecestati.value=linea.belecestati;
            besecdinama.value=linea.besecdinama;
        };
    };
    calcula();
}

function seleccionVia() {
    const Tipovia=document.getElementById("TipoVia").value;
    const Tvia=document.getElementById("Tvia=");
    const TD=document.getElementById("TD=");
    const VMaxVia=document.getElementById("VMaxVia=").value;
    const EstadoVia=document.getElementById("EstadoVia").value;
    const alfaOscI040=document.getElementById("alfaOscI040=");
    const alfaOscI030=document.getElementById("alfaOscI030=");
    const alfaOscA040=document.getElementById("alfaOscA040=");
    const alfaOscA030=document.getElementById("alfaOscA030=");

    if (Tipovia=="Balasto") {
        Tvia.value=0.025;
        if (Number(VMaxVia)>80) {TD.value=0.015}
        else {TD.value=0.02};
        if (EstadoVia=="BuenEstado") {
            alfaOscI040.value=0.1
            alfaOscI030.value=0.08
            alfaOscA040.value=0.6
            alfaOscA030.value=0.45
        }else if(EstadoVia=="MalEstado"){
            alfaOscI040.value=0.2
            alfaOscI030.value=0.15
            alfaOscA040.value=1
            alfaOscA030.value=0.75
        };
    }
    else if (Tipovia=="Placa"){
        Tvia.value=0.005
        TD.value=0.005
        alfaOscI040.value=0.1
        alfaOscI030.value=0.08
        alfaOscA040.value=0.6
        alfaOscA030.value=0.45
    };
    calcula();
};
