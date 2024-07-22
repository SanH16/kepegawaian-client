/* eslint-disable react-refresh/only-export-components */
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button, Tooltip } from "antd";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import { selectGetUserLogin } from "@/store/auth-get-user-slice";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";

export const ColumnPHK = (handleOpenModalDelete) => {
  const userState = useSelector(selectGetUserLogin);
  const verifRole = userState?.data?.role === "direktur";

  return [
    {
      title: "ID",
      dataIndex: "uuid",
      key: "uuid",
      width: 50,
      render: (val) => <span>{val.slice(0, 5)}</span>,
    },
    {
      title: "Nama Pegawai",
      dataIndex: "nama_pegawai",
      key: "nama_pegawai",
      width: 150,
      sorter: (a, b) => a.nama_pegawai.localeCompare(b.nama_pegawai),
    },
    {
      title: "Alasan PHK",
      dataIndex: "alasan_phk",
      key: "alasan_phk",
      width: 250,
      render: (val) => <span className="line-clamp-1">{val}</span>,
    },
    {
      title: "Tanggal Dibuat",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      render: (val) => {
        return dayjs(val).format("DD MMMM YYYY");
      },
    },
    {
      title: "Tanggal Berhenti Bekerja",
      dataIndex: "tanggal_keluar",
      key: "tanggal_keluar",
      width: 150,
      sorter: (a, b) => a.tanggal_keluar.localeCompare(b.tanggal_keluar),
      render: (val) => {
        return dayjs(val).format("DD MMMM YYYY");
      },
    },
    {
      title: "Action",
      width: 100,
      className: "text-center",
      render: (record) => {
        return (
          <>
            {verifRole ? (
              <>
                <Link to={`/update-phk/${record.uuid}`}>
                  <Button
                    type="primary"
                    className="me-2 h-[30px] w-[32px] p-0"
                    disabled={!verifRole}
                  >
                    <FaRegEdit className="p-[2px] text-[20px]" />
                  </Button>
                </Link>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModalDelete(record);
                  }}
                  className="h-[30px] w-[32px] border-red-500 p-0 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <MdOutlineDeleteSweep className="text-[20px]" />
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center text-2xl font-semibold text-green-500 duration-100 hover:text-link">
                <Tooltip title="Click row">
                  <IoInformationCircleOutline className="text-2xl font-semibold text-green-500 duration-100 hover:text-link" />
                </Tooltip>
              </div>
            )}
          </>
        );
      },
    },
  ];
};
