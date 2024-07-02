/* eslint-disable react-refresh/only-export-components */
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "antd";
import { Link } from "react-router-dom";

export const ColumnCuti = (handleOpenModalDelete) => [
  {
    title: "ID",
    dataIndex: "uuid",
    key: "uuid",
    width: 50,
    render: (val) => <span>{val.slice(0, 5)}</span>,
  },
  {
    title: "Nama Pegawai",
    dataIndex: ["user", "name"],
    // render: (user) => user.map((item) => item.name).join(),
    key: "user",
    width: 150,
    sorter: (a, b) => a.user.name.localeCompare(b.user.name),
  },
  {
    title: "Alasan Cuti",
    dataIndex: "alasan_cuti",
    key: "alasan_cuti",
    width: 250,
  },
  {
    title: "Tanggal Mulai",
    dataIndex: "start_cuti",
    key: "start_cuti",
    width: 150,
    sorter: (a, b) => a.start_cuti.localeCompare(b.start_cuti),
    render: (val) => {
      return dayjs(val).format("DD MMMM YYYY");
    },
  },
  {
    title: "Berakhir Cuti",
    dataIndex: "end_cuti",
    key: "end_cuti",
    width: 150,
    sorter: (a, b) => a.end_cuti.localeCompare(b.end_cuti),
    render: (val) => {
      return dayjs(val).format("DD MMMM YYYY");
    },
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan",
    width: 100,
    sorter: (a, b) => a.keterangan.localeCompare(b.keterangan),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 150,
    render: (_, { status }) => {
      let text;
      let color;
      if (status === "processed") {
        (color = "text-link bg-link-25 w-28"), (text = "Berjalan");
      }
      if (status === "waiting") {
        (color = "text-warning bg-warning-25 w-28"), (text = "Menunggu");
      }
      if (status === "done") {
        (color = "text-positive bg-positive-25 w-28"), (text = "Selesai");
      }
      if (status === "cancelled") {
        (color = "text-negative bg-negative-25 w-28"), (text = "Dibatalkan");
      }
      return (
        <Button className={color} key={status} type="primary">
          <span className="font-medium">{text}</span>
        </Button>
      );
    },
  },
  {
    title: "Action",
    width: 200,
    render: (record) => {
      return (
        <>
          <Link to={`/update-cuti/${record.uuid}`}>
            <Button type="primary" className="me-1 w-[80px]">
              <span className="font-medium">Update</span>
            </Button>
          </Link>

          <Button
            onClick={() => handleOpenModalDelete(record)}
            className="mt-2 w-[80px] border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <span className="font-medium">Delete</span>
          </Button>
        </>
      );
    },
  },
];
