namespace logical.data;

 entity sample_tbl{
        key id :Integer not null;
        txt: String;
    }
    
@cds.persistence.exists
entity T_COR_PROYECTO {
    key ID_PROYECTO:String(10) not null;
    PROYECTO:String(40);
}