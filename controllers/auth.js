const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFronEnd } = require('../helpers/menu-frontend');


const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );


        res.json({
            ok: true,
            token,
            menu: getMenuFronEnd(usuarioDB.role )
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}



const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    try{
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else{
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        //Generar Token - JWT
        const token = await generarJWT (usuario.id)


        res.json({
            ok: true,
            //googleToken
            token,
            menu: getMenuFronEnd(usuario.role )
        });

    }catch(error){
        res.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        });
    }

}


const renewToken = async(req, res = response) => {

    const uid = req.uid
    //Generar Token - JWT
    const token = await generarJWT (uid)
    //Obtener user
    const usuario = await Usuario.findById( uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFronEnd(usuario.role )
    })

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}
