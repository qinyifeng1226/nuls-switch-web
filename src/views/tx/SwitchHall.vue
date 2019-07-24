<template>
    <div class="address-info bg-gray">
        <div class="bg-white">
            <div class="title font24 w1200">
                <el-select v-model="fromTokenId" @change="changeTokenType">
                    <el-option v-for="item in fromTokenOptions" :key="item.tokenId" :label="item.tokenSymbol"
                               :value="item.tokenId">
                    </el-option>
                </el-select>
                —>
                <el-select v-model="toTokenId">
                    <el-option v-for="item in toTokenOptions" :key="item.tokenId" :label="item.tokenSymbol"
                               :value="item.tokenId">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="top w1200">
            <div class="order">
                <div class="top-left fl">
                    <h3 class="tabs_title tabs_header capitalize">{{$t('switch.myWantBuy')}}</h3>
                    <div class="order_left">
                        <el-row class="order_row">
                            <div class="order_label"><span>价格：</span></div>
                            <div class="order_input">
                                <el-input type="input" v-model="buyTokenForm.price" placeholder="请设置单价"></el-input>
                            </div>
                            <div class="order_span"><span>USDT</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>数量：</span></div>
                            <div class="order_input">
                                <el-input type="input" v-model="buyTokenForm.txNum" placeholder="请输入购买数量"></el-input>
                            </div>
                            <div class="order_span"><span>NULS</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>可用：</span></div>
                            <div class="order_label"><span>1000</span></div>
                            <div class="order_label"><span>USDT</span></div>
                        </el-row>
                        <el-row class="order_btn_row">
                            <el-button type="primary">{{$t('switch.buy')}}</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="top-left fl">
                    <h3 class="tabs_title tabs_header capitalize">{{$t('switch.myWantSell')}}</h3>
                    <div class="order_left">
                        <el-row class="order_row">
                            <div class="order_label"><span>价格：</span></div>
                            <div class="order_input">
                                <el-input type="input" v-model="buyTokenForm.price" placeholder="请设置单价"></el-input>
                            </div>
                            <div class="order_span"><span>USDT</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>数量：</span></div>
                            <div class="order_input">
                                <el-input type="input" v-model="buyTokenForm.txNum" placeholder="请输入购买数量"></el-input>
                            </div>
                            <div class="order_span"><span>NULS</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>可用：</span></div>
                            <div class="order_label"><span>1000</span></div>
                            <div class="order_label"><span>NULS</span></div>
                        </el-row>
                        <el-row class="order_btn_row">
                            <el-button type="primary">{{$t('switch.sell')}}</el-button>
                        </el-row>
                    </div>
                </div>
            </div>

            <div class="top-right fr">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="$t('switch.myWantBuy')" name="buyTab">
                        <el-table :data="buyList" stripe border style="width: 100%;" class="mt_20"
                                  v-loading="buyListLoading">
                            <el-table-column label="" width="30">
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.price')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.price }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.num')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.totalNum }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('switch.buy')" width="120" align="left">
                                <template slot-scope="scope">买入</template>
                            </el-table-column>
                        </el-table>
                        <div class="paging">
                            <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                                           v-show="buyListPager.total > sellListPager.rows"
                                           :total="buyListPager.total"
                                           :current-page.sync="buyListPager.page"
                                           :pager-count=5
                                           :page-size="buyListPager.rows" @current-change="pagesBuyListList">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('switch.myWantSell')" name="sellTab">
                        <el-table :data="sellList" stripe border style="width: 100%;" class="mt_20"
                                  v-loading="sellListLoading">
                            <el-table-column label="" width="30">
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.price')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.price }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.num')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.totalNum }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('switch.sell')" width="120" align="left">
                                <template slot-scope="scope">卖出</template>
                            </el-table-column>
                        </el-table>
                        <div class="paging">
                            <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                                           v-show="sellListPager.total > sellListPager.rows"
                                           :total="sellListPager.total"
                                           :current-page.sync="sellListPager.page"
                                           :pager-count=5
                                           :page-size="sellListPager.rows" @current-change="pagesSellListList">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="cb"></div>
        <div class="bottoms w1200 cb">
            <el-tabs v-model="depositActiveName">
                <el-tab-pane :label="$t('switch.currentDeposit')" name="depositTab">
                    <el-table :data="buyList" stripe border style="width: 100%;" class="mt_20"
                              v-loading="buyListLoading">
                        <el-table-column label="" width="30">
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.createTime')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.createTime }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.txPair')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.txPair }}</template>
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
                        <el-table-column :label="$t('orderInfo.status')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.status }}</template>
                        </el-table-column>
                    </el-table>
                    <div class="paging">
                        <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                                       v-show="depositListPager.total > depositListPager.rows"
                                       :total="depositListPager.total"
                                       :current-page.sync="depositListPager.page"
                                       :pager-count=5
                                       :page-size="depositListPager.rows" @current-change="pagesDepositListList">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    //import nuls from 'nuls-sdk-js'
    import moment from 'moment'
    import {getLocalTime, superLong, copys, timesDecimals, Plus} from '@/api/util.js'
    import {listOnSell} from '@/api/requestData'

    export default {
        data() {
            return {
                buyTokenForm: {
                    price: '',
                    txNum: '',
                },
                isMobile: true,
                activeName: 'buyTab',
                depositActiveName: 'depositTab',
                //交易类型
                typeRegion: 0,
                //地址
                //address: this.$route.query.address,
                address: 'my',
                //地址详情
                addressInfo: [],
                addressNumber: [],
                //可买挂单列表
                buyList: [],
                //可买挂单列表分页信息
                buyListPager: {
                    total: 0,
                    page: 1,
                    rows: 2,
                },
                //可买挂单列表加载动画
                buyListLoading: true,
                //可卖挂单列表
                sellList: [],
                //可卖挂单列表分页信息
                sellListPager: {
                    total: 0,
                    page: 1,
                    rows: 2,
                },
                //可卖挂单列表加载动画
                sellListLoading: true,
                //当前委托列表
                depositList: [],
                //当前委托列表分页信息
                depositListPager: {
                    total: 0,
                    page: 1,
                    rows: 2,
                },
                //当前委托列表加载动画
                depositListLoading: true,
                //隐藏共识奖励
                hideSwitch: false,
                fromTokenId: '',
                fromTokenOptions: [{
                    'tokenId': 1,
                    'tokenSymbol': 'NULS',
                    'switchTokenList': [
                        {
                            'tokenId': 2,
                            'tokenSymbol': 'USDT'
                        },
                        {
                            'tokenId': 3,
                            'tokenSymbol': 'ETH'
                        },
                        {
                            'tokenId': 4,
                            'tokenSymbol': 'BTC'
                        }
                    ]
                }, {
                    'tokenId': 2,
                    'tokenSymbol': 'USDT',
                    'switchTokenList': [
                        {
                            'tokenId': 1,
                            'tokenSymbol': 'NULS'
                        },
                        {
                            'tokenId': 3,
                            'tokenSymbol': 'ETH'
                        },
                        {
                            'tokenId': 4,
                            'tokenSymbol': 'BTC'
                        }
                    ]
                }
                ],
                toTokenId: '',
                toTokenOptions: [],
                tokenOptions: [],
                //token类型
                //tokenValue: '',
                //地址定时器
                addressInterval: null,
            }
        },
        components: {
            //SelectBar
        },
        created() {
            this.isMobile = /(iPhone|iOS|Android|Windows Phone)/i.test(navigator.userAgent);
            //this.getAddressInfo(this.address);
            this.pagesBuyListList();
            this.pagesDepositListList();
        },
        mounted() {
            //延迟加载饼状图
            setTimeout(() => {
                // this.chartData = {
                //     columns: ['location', 'value'],
                //     rows: this.addressNumber
                // };
            }, 500);

            //定时获取地址
            this.addressInterval = setInterval(() => {
                this.address = this.$route.query.address;
            }, 500)
        },
        beforeDestroy() {
            //离开界面清除定时器
            if (this.addressInterval) {
                clearInterval(this.addressInterval);
            }
        },
        methods: {
            /**
             * 复制方法
             * @param sting
             **/
            copy(sting) {
                copys(sting);
                this.$message({message: this.$t('public.copysuccess'), type: 'success', duration: 1000});
            },

            /**
             * 获地址详细信息
             */
            getAddressInfo(address) {
                // this.$post('/', 'getAccount', [address])
                //     .then((response) => {
                //         //console.log(response);
                //         if (response.hasOwnProperty("result")) {
                //             response.result.totalBalance = timesDecimals(response.result.totalBalance, 8);
                //             response.result.balances = timesDecimals(response.result.balance, 8);
                //             response.result.totalLock = Plus(response.result.timeLock, response.result.consensusLock).toString();
                //             response.result.totalLocks = timesDecimals(response.result.totalLock, 8);
                //             response.result.timeLock = timesDecimals(response.result.timeLock, 8);
                //             response.result.consensusLock = timesDecimals(response.result.consensusLock, 8);
                //             response.result.totalIn = timesDecimals(response.result.totalIn, 8);
                //             response.result.totalOut = timesDecimals(response.result.totalOut, 8);
                //
                //             if (parseInt(response.result.balance) > 0) {
                //                 this.addressNumber.push({
                //                     location: this.$t('public.usablebalance'),
                //                     value: parseInt(timesDecimals(response.result.balance, 8))
                //                 });
                //             }
                //             if (parseInt(response.result.totalLock) > 0) {
                //                 this.addressNumber.push({
                //                     location: this.$t('public.consensusLocking'),
                //                     value: parseInt(timesDecimals(response.result.totalLock, 8))
                //                 });
                //             }
                //
                //             //循环代币
                //             for (let item in response.result.tokens) {
                //                 this.tokenOptions[item] = response.result.tokens[item].split(',');
                //             }
                //             this.tokenOptions.unshift(["", this.$t('type.0')]);
                //             this.addressInfo = response.result;
                //         }
                //     })
            },

            /**
             * tab 选项
             **/
            handleClick(tab) {
                this.activeName = tab.name;
                if (tab.name === 'buyTab') {
                    // 查询可买挂单列表
                    this.buyListLoading = true;
                    this.pagesBuyListList();
                } else if (tab.name === 'sellTab') {
                    // 查询可卖挂单列表
                    this.sellListLoading = true;
                    this.pagesSellListList(this.sellListPager.page, this.sellListPager.rows, this.address, "")
                }
            },

            /**
             * 根据地址获取可买挂单列表
             */
            getBuyListByAddress(page, rows, address) {
                let params = {"current": page, "pageSize": rows, "address": address, "fromTokenId": this.fromTokenId, "toTokenId": this.toTokenId};
                this.$get('/v1/order/listOnSell', '', params)
                    .then((response) => {
                        //console.log(response);
                        if (response.hasOwnProperty("result")) {
                            // for (let item of response.result.records) {
                            //     item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                            //     item.price = timesDecimals(item.price, 8);
                            //     item.totalNum = timesDecimals(item.totalNum, 8);
                            // }
                            this.buyList = response.result.records;
                            this.buyListPager.total = response.result.total;
                            this.buyListLoading = false;
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },

            // this.listOnSell({"pageNumber":pageNumber,"pageSize":_self.pageSize,"address":_self.address},function(res){
            //
            // }),

            /**
             * 根据地址获取可买挂单列表 分页
             */
            pagesBuyListList() {
                this.getBuyListByAddress(this.buyListPager.page, this.buyListPager.rows, this.address);
            },

            /**
             * 根据地址获取可卖挂单列表
             */
            getSellListByAddress(page, rows, address) {
                let params = {"current": page, "pageSize": rows, "address": address, "fromTokenId": this.fromTokenId, "toTokenId": this.toTokenId};
                this.$get('/v1/order/listOnBuy', '', params)
                //this.$get('/', 'getTokenTransfers', [page, rows, address, contractAddress])
                    .then((response) => {
                        //console.log(response);
                        if (response.hasOwnProperty("result")) {
                            // for (let item of response.result.list) {
                            //   item.createTime = moment(getLocalTime(item.time)).format('YYYY-MM-DD HH:mm:ss');
                            //   item.fromAddresss = superLong(item.fromAddress, 6);
                            //   item.toAddresss = superLong(item.toAddress, 6);
                            //   item.value = timesDecimals(item.value, item.decimals);
                            //   item.fromBalance = timesDecimals(item.fromBalance, item.decimals);
                            //   item.toBalance = timesDecimals(item.toBalance, item.decimals);
                            //   item.txHashs = superLong(item.txHash, 10);
                            //   item.showValue = this.address === item.toAddress;
                            // }
                            this.sellList = response.result.records;
                            this.sellListPager.total = response.result.total;
                            this.sellListLoading = false;
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },

            /**
             * 根据地址获取Token交易列表分页
             */
            pagesSellListList() {
                this.getSellListByAddress(this.sellListPager.page, this.sellListPager.rows, this.address);
            },

            /**
             * 根据地址获取当前委托列表
             */
            getDepositListByAddress(page, rows, address) {
                let params = {"current": page, "pageSize": rows, "address": address};
                this.$get('/v1/order/queryMyCurrentOrder', '', params)
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            // for (let item of response.result.records) {
                            //     item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                            //     item.price = timesDecimals(item.price, 8);
                            //     item.totalNum = timesDecimals(item.totalNum, 8);
                            // }
                            this.depositList = response.result.records;
                            this.depositListPager.total = response.result.total;
                            this.depositListLoading = false;
                            console.log("dep: "+response.result.total);
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },

            /**
             * 根据地址获取当前委托列表 分页
             */
            pagesDepositListList() {
                this.getDepositListByAddress(this.buyListPager.page, this.buyListPager.rows, this.address);
            },

            /**
             * 选择代币类型
             **/
            // changeToken() {
            //     this.getTokenListByAddress(this.sellListPager.page, this.sellListPager.rows, this.address, this.tokenValue);
            // },

            changeTokenType() {
                console.log("size: " + this.fromTokenOptions.length)
                //循环fromTokenOptions数组
                for (let i = 0; i < this.fromTokenOptions.length; i++) {
                    //如果当前点击的数组value等于他自己当前v-model
                    console.log("fromtokenid: " + this.fromTokenId);
                    console.log("for fid: " + this.fromTokenOptions[i].tokenId)
                    if (this.fromTokenOptions[i].tokenId == this.fromTokenId) {
                        //就把数组label绑定le2list
                        console.log(this.fromTokenOptions[i].switchTokenList)
                        this.toTokenOptions = this.fromTokenOptions[i].switchTokenList;
                    }
                }
            },

            /**
             * url 连接跳转
             * @param name
             * @param parmes
             */
            toUrl(name, parmes) {
                let newParmes = {};
                if (name === 'addressInfo') {
                    this.address = parmes;
                    newParmes = {address: parmes}
                } else if (name === 'blockInfo') {
                    newParmes = {height: parmes}
                } else if (name === 'contractsInfo') {
                    newParmes = {contractAddress: parmes, tabName: 'first'}
                } else if (name === 'tokenInfo') {
                    newParmes = {contractAddress: parmes}
                } else {
                    newParmes = {hash: parmes}
                }
                this.$router.push({
                    name: name,
                    query: newParmes
                })

            },

            /**
             * 获取交易类型
             **/
            // changeType(type) {
            //     this.buyListLoading = true;
            //     this.typeRegion = parseInt(type);
            //     this.getTxListByAddress(this.buyListPager.page, this.buyListPager.rows, this.address, this.typeRegion, this.hideSwitch);
            // },

            /**
             * 隐藏共识奖励
             */
            // hideConsensusList() {
            //     this.buyListLoading = true;
            //     this.getTxListByAddress(this.txListPager.page, this.txListPager.rows, this.address, this.typeRegion, this.hideSwitch);
            // },

        },

        watch: {
            address: function () {
                // address，当放生变化时，重新获取数据
                this.activeName = 'buyTab';
                this.addressNumber = [];
                //this.buyListLoading = true;
                //this.getAddressInfo(this.address);
                //this.pagesBuyListList();
                //this.pagesDepositListList();
                //延迟加载饼状图
                setTimeout(() => {

                }, 500);
            }
        }
    }
</script>

<style lang="less">
    @import "./../../assets/css/style";

    .address-info {
        //min-height: 800px;
        margin-bottom: 10px;

        .bg-white {
            height: 100px;

            .title {
                padding-bottom: 0px;
                margin: 0px auto 0;

                .click {
                    margin-left: 20px;
                }

                @media screen and (max-width: 1000px) {
                    padding: 0 0 1.8rem 0.5rem;
                    font-size: 0.9rem;
                    .click {
                        margin-left: 1rem;
                        font-size: 0.9rem;
                    }
                }
            }
        }

        .top {
            margin: -24px auto 0;
            height: 255px;
            @media screen and (max-width: 1000px) {
                height: auto;
            }

            .top-left {
                margin-left: 5px;
                width: 300px;
                height: 255px;
                border: @BD1;
                border-radius: 3px;
                background-color: @Bcolour1;
                @media screen and (max-width: 1000px) {
                    width: 95%;
                    height: auto;
                }

                .tabs_title {
                    padding: 5px 0 0 0px;
                    text-align: center;
                    height: 30px;
                }

                .tabs_header {
                    background: #F5F6F8;
                    font-size: 16px;
                    font-weight: 700;
                    color: #475472;
                }
            }

            .order {
                width: 680px;
                height: 300px;
                float: left
            }

            .order_left {
                .order_row {
                    padding-top: 15px;

                    .order_label {
                        width: 60px;
                        float: left;
                        display: inline;
                        padding: 10px 0 0 5px;
                    }

                    .order_input {
                        width: 160px;
                        float: left;
                        display: inline;
                    }

                    .order_span {
                        width: 60px;
                        float: left;
                        display: inline;
                        padding: 10px 0 0 5px;
                    }
                }

                .order_btn_row {
                    padding-top: 20px;
                    text-align: center
                }
            }

            .top-right {
                width: 500px;
                height: 255px;
                border: @BD1;
                border-radius: 3px;
                background-color: @Bcolour1;
                @media screen and (max-width: 1000px) {
                    width: 95%;
                    height: auto;
                }

                .tabs_title {
                    padding: 0 0 0 30px;
                }
            }

            .top-left {
                @media screen and (max-width: 1000px) {
                    display: none;
                }
            }

            .top-right {
                margin: 0 0 0 20px;
                @media screen and (max-width: 1000px) {
                    margin: 0 0 0 2.5%;
                }

                .total_ul {
                    margin: 0 20px;

                    li {
                        border-bottom: @BD1;
                        padding: 0 10px;
                        color: @Acolor3;

                        &:last-child {
                            border-bottom: 0
                        }

                        span {
                            color: @Mcolour;
                        }

                        .click {
                            color: @Ccolour;
                        }
                    }
                }
            }
        }

        .bottoms {
            margin: 30px auto 14px;
            @media screen and (max-width: 1000px) {
                margin: 1.5rem auto 1.5rem ;
                width: 95%;
            }

            .el-icon-download {
                margin-left: 10px;
                font-size: 20px;
            }

            .hide-switch {
                margin: 10px 0 0 0;
                @media screen and (max-width: 1000px) {
                    margin: 0.5rem 0.5rem 0 0;
                }
            }
        }
    }
</style>
