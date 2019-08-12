<template>
  <div class="new-address bg-gray">
    <el-table :data="depositList" stripe border class="mt_0 el-deposit-table"
              v-loading="depositListLoading">
      <el-table-column label="" width="30">
      </el-table-column>
      <el-table-column :label="$t('orderInfo.createTime')" width="170" align="left">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column :label="$t('orderInfo.txType')" width="120" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.txType ==1">{{$t('switch.buy')}}</span>
          <span v-else>{{$t('switch.sell')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('orderInfo.tokenPair')" width="170" align="left">
        <template slot-scope="scope">{{ scope.row.tokenPair }}</template>
      </el-table-column>
      <el-table-column :label="$t('orderInfo.price')" width="170" align="left">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column :label="$t('orderInfo.num')" width="170" align="left">
        <template slot-scope="scope">{{ scope.row.txNum }}/{{ scope.row.totalNum }}</template>
      </el-table-column>
      <el-table-column :label="$t('orderInfo.totalAmount')" width="170" align="left">
        <template slot-scope="scope">{{ scope.row.totalAmount }}</template>
      </el-table-column>
      <el-table-column :label="$t('orderInfo.status')" width="180" align="left">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="cancelOrderClick(scope.row.orderId)">取消</el-button>
          <span v-if="scope.row.status==1"> | </span>
          <el-button type="text" size="mini" @click="getOrderTradeClick(scope.row.orderId, scope.row.price)" v-if="scope.row.status==1">确认</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging">
      <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                     v-show="depositListPager.total > depositListPager.rows"
                     :total="depositListPager.total"
                     :current-page.sync="depositListPager.page"
                     :pager-count=5
                     :page-size="depositListPager.rows" @current-change="pagesDepositList">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {API_CHAIN_ID} from '@/config'
  import {chainIdNumber} from '@/api/util'
  import {queryMyHisOrder} from '@/api/requestData'

  export default {
    data() {

      return {
        //历史委托列表
        depositList: [],
        //历史委托列表分页信息
        depositListPager: {
          total: 0,
          page: 1,
          rows: 15,
        },
        //历史委托列表加载动画
        depositListLoading: true
      };
    },
    created() {
      this.pagesDepositList();
    },
    methods: {
      /**
       * 根据地址获取当前委托列表
       */
      getDepositListByAddress(page, rows, address) {
        let params = {"current": page, "pageSize": rows, "address": address};
        queryMyHisOrder(params)
                .then((response) => {
                  if (response.hasOwnProperty("result")) {
                    for (let item of response.result.records) {
                      //item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                      item.price = divDecimals(item.price, 8);
                      item.txNum = divDecimals(item.txNum, 8);
                      item.totalNum = divDecimals(item.totalNum, 8);
                      item.totalAmount = divDecimals(item.totalAmount, 8);
                    }
                    this.depositList = response.result.records;
                    this.depositListPager.total = response.result.total;
                    this.depositListLoading = false;
                  }
                }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 根据地址获取当前委托列表 分页
       */
      pagesDepositList() {
        this.getDepositListByAddress(this.depositListPager.page, this.depositListPager.rows, this.address);
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .new-address {
    .bg-white {
    }
    .tab {
      .tips {
        margin: 40px auto;
        padding: 20px 30px;
        p {
          line-height: 24px;
          i {
            width: 5px;
            height: 5px;
            display: block;
            float: left;
            margin: 9px 10px 0 0;
            border-radius: 5px;
            background: #000000;
          }
        }
      }
      .pass-form {

      }

    }
  }

</style>
