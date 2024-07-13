import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button, Card, ConfigProvider, Flex, Space, Table } from "antd";
import { MdOutlineFileUpload } from "react-icons/md";
import { ModalDeleteAbsensi } from "@/components/shared-components/ModalDeleteAbsensi";

import { useQuery } from "@tanstack/react-query";
import { APIpenugasan } from "@/apis/APIpenugasan";
import { FilterSearchTable } from "@/components/shared-components/FilterSearchTable";

import { ColumnPenugasan } from "../constant/column-penugasan";
import { useState } from "react";
import { CardPenugasan } from "../misc/CardPenugasan";

export function TablePenugasan() {
  useDocumentTitle("Halaman Penugasan");
  useScrollToTop();

  const [isShowDelete, setIsShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  //   const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModalDelete = (user) => {
    setUserToDelete(user);
    setIsShowDelete((prev) => !prev);
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["penugasanData"],
    queryFn: async () => {
      const result = await APIpenugasan.getAllPenugasan();
      return result;
    },
  });
  const dataPenugasan = data || [];
  console.log("table tugas", dataPenugasan);
  return (
    <>
      <Flex justify="space-between" className="mb-6">
        <Space size="middle">
          <h3 className="mb-3 font-bold">Penugasan Pegawai</h3>
        </Space>

        <Space size="middle">
          <Button
            id="tambah-absensi"
            className="flex border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            //   onClick={handleOpenModal}
          >
            <span className="me-2 text-lg">
              <MdOutlineFileUpload />
            </span>
            Tambah Tugas
          </Button>
        </Space>
      </Flex>
      <CardPenugasan data={dataPenugasan} />
      <Card>
        <FilterSearchTable
          //   setSearchValue={setSearchValue}
          title="Daftar Penugasan"
          placeholder="data penugasan (judul/divisi)"
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
            // loading={isLoading}
            columns={ColumnPenugasan(handleOpenModalDelete)}
            dataSource={dataPenugasan}
            scroll={{ x: true }}
            style={{ maxWidth: "100%" }}
            // onRow={(record) => ({
            //   onClick: () => handleRowClick(record),

            // })}
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
        <ModalDeleteAbsensi
          closeModal={handleOpenModalDelete}
          stateModal={userToDelete}
          //   refetchDelete={refetch}
        />
      )}

      {/* <Modal
        title="Tambah Absensi"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
      >
        <AddAbsensi onClose={handleCloseModal} refetchAbsensi={refetch} />
      </Modal> */}
    </>
  );
}
