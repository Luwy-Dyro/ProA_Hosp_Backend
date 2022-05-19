const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')


    res.json({
        ok: true,
        medicos
    })
}


const getMedicoById = async(req, res = response) => {
    const id = req.params.id
   
    try{
    const medico = await Medico.findById(id)
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')


    res.json({
        ok: true,
        medico
    })
    }catch(error){
        res.json({
            ok: true,
            msg: 'No ubicado -Hable con el Admin'
        })
    }
}


const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();

        
        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id
    const uid = req.uid

    try{

        const medico = await Medico.findById(id);

        if ( !medico){
            
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado',
    
            })
        }

      
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const MedicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true })

        return res.json({
            ok: true,
            medico: MedicoActualizado

        })

    }catch(error){
        console.log();
        res.status(500).json({
            ok: false,
            msg: 'Contácte al Admin'
        })
    }
    
}


const borrarMedico = async(req, res = response) => {
    
    const id = req.params.id
    

    try{

        const medico = await Medico.findById(id);

        if ( !medico){
            
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado',
    
            })
        }

      
    await Medico.findOneAndDelete(id);

        return res.json({
            ok: true,
            medico: 'Medico eliminado'

        })

    }catch(error){
        console.log();
        res.status(500).json({
            ok: false,
            msg: 'Contácte al Admin'
        })
    }
}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}