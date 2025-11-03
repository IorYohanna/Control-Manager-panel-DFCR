import React from "react";
import ModalView from "../ui/modal/ViewEvent";
import ModalDelete from "../ui/modal/DeleteEvent";
import ModalEdit from "../ui/modal/EditEvent";

export const EventModal = (props) => {
  const close = () => props.setOpen(false);
  const { type } = props;

  if (type === 'view') return <ModalView {...props} close={close} />;
  if (type === 'delete') return <ModalDelete {...props} close={close} />;
  return <ModalEdit isEdit={type === 'edit'} {...props} close={close} />;
};