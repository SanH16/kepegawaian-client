import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button, Card, ConfigProvider, Flex, Modal, Space, Table } from "antd";
import { MdOutlineFileUpload } from "react-icons/md";
import { ModalDeletePenugasan } from "@/components/shared-components/ModalDeletePenugasan";

import { useQuery } from "@tanstack/react-query";
import { APIpenugasan } from "@/apis/APIpenugasan";
import { FilterSearchTable } from "@/components/shared-components/FilterSearchTable";

import { ColumnPenugasan } from "../constant/column-penugasan";
import { useState } from "react";
import UpdateTugas from "../misc/UpdateTugas";

import { useDebounce } from "@/hooks/useDebounce";
import { selectGetUserLogin } from "@/store/auth-get-user-slice";
import { useSelector } from "react-redux";
import { CardTable } from "@/components/shared-components/CardTable";
import { Link } from "react-router-dom";

import * as XLSX from "xlsx";
import dayjs from "dayjs";
import "dayjs/locale/id";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function TablePenugasan() {
  useDocumentTitle("Halaman Penugasan");
  useScrollToTop();
  const userState = useSelector(selectGetUserLogin);
  const verifRole = userState?.data?.role === "admin";

  const [isShowDelete, setIsShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  //   const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const searchQuery = useDebounce(searchValue, 800);

  const handleOpenModalDelete = (user) => {
    setUserToDelete(user);
    setIsShowDelete((prev) => !prev);
  };

  const handleRowClick = (record) => {
    setSelectedPenugasan(record); // Set selected item untuk update modal
    setIsUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedPenugasan(null); // Reset
  };

  const todayDate = dayjs().format("dddd,DD-MM-YYYY");

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["penugasanData", searchQuery],
    queryFn: async () => {
      const result = await APIpenugasan.getAllPenugasan();
      // Logika filter
      let filteredData = result;
      if (searchQuery) {
        filteredData = result.filter((data) => {
          const filterBy =
            data.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.divisi.toLowerCase().includes(searchQuery.toLowerCase());
          return filterBy;
        });
      }

      return filteredData;
    },
  });
  const dataPenugasan = data || [];

  const handleDownloadExcel = () => {
    const newData = dataPenugasan.map((row) => {
      return {
        ...row,
        email: row.user.email,
        name: row.user.name,
        role: row.user.role,
        jabatan: row.user.pegawai.jabatan,
      };
    });
    const workSheet = XLSX.utils.json_to_sheet(newData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "penugasan");
    XLSX.writeFile(workBook, `Rekap_Penugasan_Radenmat-${todayDate}.xlsx`);
  };

  const handleDownloadPdf = () => {
    const columns = [
      { header: "ID", datakey: "uuid" },
      { header: "Judul", datakey: "judul" },
      { header: "Divisi", datakey: "divisi" },
      { header: "Penempatan", datakey: "penempatan" },
      { header: "Durasi Waktu penugasan", datakey: "durasi_waktu" },
      { header: "Tanggal Mulai tugas", datakey: "start" },
      { header: "Dibuat Oleh", datakey: "createdby" },
      { header: "Status", datakey: "status_tugas" },
      { header: "Task Diselesaikan", datakey: "completedTasks" },
      { header: "Task Belum Selesai", datakey: "incompletedTasks" },
    ];

    const formattedData = dataPenugasan.map((row) => {
      const durasiWaktu = JSON.parse(row.durasi_waktu);
      const tasksList = JSON.parse(row.tasks_list);
      const completedTasks = tasksList
        .filter((task) => task.checked === true)
        .map((task) => task.name)
        .join(", ");
      const incompletedTasks = tasksList
        .filter((task) => task.checked === false)
        .map((task) => task.name)
        .join(", ");
      return {
        uuid: row.uuid.slice(0, 5),
        judul: row.judul,
        divisi: row.divisi,
        penempatan: row.penempatan,
        durasi_waktu: durasiWaktu
          .map((d) => `${d.start} - ${d.end}`)
          .join(", "),
        start: dayjs(durasiWaktu[0].start).format("DD MMMM YYYY"),
        createdby: row.user.name,
        status_tugas: row.status_tugas,
        completedTasks: completedTasks,
        incompletedTasks: incompletedTasks,
      };
    });

    const docspdf = new jsPDF();
    docspdf.setFontSize(15);
    docspdf.text(
      "Data Rekap Penugasan",
      docspdf.internal.pageSize.getWidth() / 2,
      12,
      { align: "center" },
    );
    docspdf.autoTable({
      theme: "grid",
      head: [columns.map((col) => col.header)],
      body: formattedData.map((row) => columns.map((col) => row[col.datakey])),
      columnStyles: {
        0: { cellWidth: 15, fontSize: 8 }, // ID
        1: { cellWidth: 20, fontSize: 8 }, // judul
        2: { cellWidth: 15, fontSize: 8 }, // divisi
        3: { cellWidth: 25, fontSize: 8 }, // penempatan
        4: { cellWidth: 30, fontSize: 8 }, // durasi waktu
        5: { cellWidth: 20, fontSize: 8 }, // waktu mulai
        6: { cellWidth: 15, fontSize: 8 }, // dibuat oleh
        7: { cellWidth: 15, fontSize: 8 }, // status
        8: { cellWidth: 25, fontSize: 8 }, // completedTasks
        9: { cellWidth: 25, fontSize: 8 }, // incompletedTasks
      },
      margin: { right: 10, left: 5 },
      styles: { overflow: "linebreak" },
    });
    docspdf.save(`Penugasan_Radenmat-${todayDate}.pdf`);
  };

  console.log("table tugas", dataPenugasan);
  return (
    <>
      <Flex justify="space-between" className="mb-6">
        <Space size="middle">
          <h3 className="mb-3 font-bold">Penugasan Pegawai</h3>
        </Space>

        {verifRole && (
          <Space size="middle">
            <Link to={"/tambah-penugasan"}>
              <Button
                id="tambah-absensi"
                className="flex border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                <span className="me-2 text-lg">
                  <MdOutlineFileUpload />
                </span>
                Tambah Tugas
              </Button>
            </Link>
          </Space>
        )}
      </Flex>
      <CardTable data={dataPenugasan} titleCard={"Data Penugasan hari ini"} />
      <Card hoverable>
        <FilterSearchTable
          setSearchValue={setSearchValue}
          title="Daftar Penugasan"
          placeholder="data penugasan (judul/divisi)"
          handleDownloadExcel={handleDownloadExcel}
          handleDownloadPdf={handleDownloadPdf}
        />
        <ConfigProvider
          theme={{
            components: {
              Table: {
                colorPrimary: "#17c6a3",
                rowHoverBg: "#e8f9f6",
              },
              Dropdown: {
                colorPrimary: "#17c6a3",
              },
              Checkbox: {
                colorPrimary: "#17c6a3",
                colorPrimaryHover: "#15b494",
              },
              Button: {
                colorLink: "#15b494",
                colorLinkHover: "#108d74",
                colorLinkActive: "#15b494",
              },
              Pagination: {
                colorPrimary: "#17c6a3",
                colorPrimaryHover: "#15b494",
              },
            },
          }}
        >
          <Table
            id="absensi-table-list"
            rowKey="uuid"
            rowClassName={"hover:cursor-pointer"}
            loading={isLoading}
            columns={ColumnPenugasan(handleOpenModalDelete)}
            dataSource={dataPenugasan}
            scroll={{ x: true }}
            style={{ maxWidth: "100%" }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 3,
              total: dataPenugasan.length,
              showTotal: (total, range) =>
                `Menampilkan ${range[0]}-${range[1]} dari ${total} data`,
            }}
            summary={() =>
              isError !== null && !isLoading && isError ? (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={10}>
                    <p className="text-center">
                      Terjadi kesalahan! silahkan kembali beberapa saat lagi.
                    </p>
                    <p className="text-center text-negative">{isError}</p>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              ) : (
                <></>
              )
            }
          />
        </ConfigProvider>
      </Card>
      {/* drawer & modal */}
      {isShowDelete && (
        <ModalDeletePenugasan
          closeModal={handleOpenModalDelete}
          stateModal={userToDelete}
          refetchDelete={refetch}
        />
      )}

      <Modal
        title="Daily Task"
        open={isUpdateModalVisible}
        onCancel={handleCloseUpdateModal}
        footer={null}
        width={900}
      >
        <UpdateTugas
          onClose={handleCloseUpdateModal}
          refetchPenugasan={refetch}
          updateData={selectedPenugasan}
        />
      </Modal>
    </>
  );
}
